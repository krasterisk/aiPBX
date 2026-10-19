"""Build on Actions; transfer only static assets with verified SSH and release metadata."""
import base64
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import shlex
import subprocess
import sys
import tarfile
import tempfile

if not __debug__:
    raise RuntimeError('Release validation requires Python assertions enabled')

HOST_FINGERPRINT = 'SHA256:08WKSfiu4Dpx5QXU2MIe+rT8J5ijk7hTzEVsIsS+ehw'
PUBLIC_ARGS = ('API_URL', 'STATIC_URL', 'PORT', 'TG_BOT_ID', 'GOOGLE_CLIENT_ID', 'STRIPE_PUBLISHABLE_KEY', 'SITE_URL', 'GA4_MEASUREMENT_ID', 'GOOGLE_ADS_ID', 'ADS_SIGNUP_LABEL')


def validate_target(host, user, run_id, attempt):
    assert re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?', host), 'Invalid host'
    assert re.fullmatch(r'[A-Za-z_][A-Za-z0-9_-]{0,31}', user), 'Invalid user'
    assert run_id.isdigit() and attempt.isdigit(), 'Invalid run'
    return '/app/aipbx-frontend-releases/' + run_id + '-' + attempt


def verified_host_keys(output, expected=HOST_FINGERPRINT):
    records = [line for line in output.splitlines() if line and not line.startswith('#')]
    assert records, 'No SSH host key'
    for line in records:
        fields = line.split()
        assert len(fields) == 3 and fields[1] == 'ssh-ed25519', 'Unexpected host key'
        digest = base64.b64encode(hashlib.sha256(base64.b64decode(fields[2], validate=True)).digest()).decode().rstrip('=')
        assert 'SHA256:' + digest == expected, 'Production SSH host key mismatch'
    return '\n'.join(sorted(set(records))) + '\n'


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=900)
    if result.returncode:
        raise RuntimeError('Release transport command failed')
    return result.stdout


def canonical_hash(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def validate_build_args(args):
    assert set(args) <= set(PUBLIC_ARGS), 'Unexpected build argument'
    assert all(isinstance(v, str) and '\n' not in v and len(v) < 1000 for v in args.values()), 'Invalid public argument'
    assert args.get('SITE_URL') == 'https://aipbx.ru', 'Wrong site target'
    for name in ['PORT', 'TG_BOT_ID']:
        assert not args.get(name) or args[name].isdigit(), 'Expected public numeric identifier'
    stripe = args.get('STRIPE_PUBLISHABLE_KEY', '')
    assert not stripe or stripe.startswith(('pk_live_', 'pk_test_')), 'Expected publishable key only'
    for name in ['API_URL', 'STATIC_URL', 'SITE_URL']:
        value = args.get(name, '')
        assert not value or (value.startswith(('https://', 'http://', '/')) and '@' not in value and '?' not in value), 'Invalid public URL'
    return args


def validate_file_map(files):
    assert isinstance(files, dict)
    for name, digest in files.items():
        path = PurePosixPath(name)
        assert path.parts and not path.is_absolute() and '..' not in path.parts and '\\' not in name, 'Unsafe static file path'
        assert re.fullmatch('[0-9a-f]{64}', digest), 'Invalid static file hash'
    return files


def validate_snapshot(snapshot):
    validate_build_args(snapshot['args']);validate_file_map(snapshot['baseFiles'])
    assert re.fullmatch('[0-9a-f]{64}', snapshot['baseContainerId'])
    assert re.fullmatch('sha256:[0-9a-f]{64}', snapshot['baseImage'])
    return snapshot


def read_config_command():
    code = """import json,subprocess
d=json.loads(subprocess.check_output(['sudo','-n','env','DEPLOY_SITE_URL=https://aipbx.ru','docker','compose','-f','/app/docker-compose.production.yml','-f','/app/aiPBX/deploy/frontend-site.override.yml','--env-file','/app/.env.production','config','--format','json'],text=True,stderr=subprocess.DEVNULL))
a=d['services']['frontend']['build'].get('args',{})
i=json.loads(subprocess.check_output(['sudo','-n','docker','inspect','app-frontend-1'],text=True,stderr=subprocess.DEVNULL))[0]
assert i['State']['Running']
lines=subprocess.check_output(['sudo','-n','docker','exec',i['Id'],'sh','-c','cd /usr/share/nginx/html && find . -type f -exec sha256sum {} +'],text=True,stderr=subprocess.DEVNULL)
files={}
for line in lines.splitlines():
 digest,name=line.split('  ',1)
 assert name.startswith('./')
 files[name[2:]]=digest
print(json.dumps({'args':{k:str(v) for k,v in a.items() if k in PUBLIC_KEYS and v is not None},'baseFiles':files,'baseContainerId':i['Id'],'baseImage':i['Image']}))
""".replace('PUBLIC_KEYS', repr(PUBLIC_ARGS))
    return 'python3 -c ' + shlex.quote(code)


def archive_hash(archive):
    digest = hashlib.sha256()
    with archive.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def prepare_directory_command(target):
    code = """import os,pathlib,subprocess
if not __debug__: raise RuntimeError('Validation must be enabled')
p=pathlib.Path('/app/aipbx-frontend-releases')
assert not p.is_symlink()
existed=p.exists()
if not existed:
 subprocess.run(['sudo','-n','mkdir','-m','700',str(p)],check=True)
 subprocess.run(['sudo','-n','chown',str(os.getuid())+':'+str(os.getgid()),str(p)],check=True)
assert p.is_dir() and p.stat().st_uid==os.getuid()
marker=p/'.owner'
if existed: assert marker.read_text()=='frontend-actions-artifacts-v1'
else: marker.write_text('frontend-actions-artifacts-v1')
pathlib.Path(TARGET).mkdir(mode=0o700)
""".replace('TARGET', repr(target))
    return 'python3 -c ' + shlex.quote(code)


def ssh_operation(mode):
    host, user = os.environ['PRODUCTION_HOST'], os.environ['PRODUCTION_USER']
    target = validate_target(host, user, os.environ['GITHUB_RUN_ID'], os.environ['GITHUB_RUN_ATTEMPT'])
    archive = Path(os.environ['RUNNER_TEMP']) / 'frontend-release.tar.gz'
    if mode == 'upload':
        assert archive.is_file() and archive.with_suffix('.gz.sha256').is_file(), 'Missing release archive'
    known_hosts = verified_host_keys(run(['ssh-keyscan', '-T', '10', '-t', 'ed25519', host]))
    with tempfile.TemporaryDirectory(prefix='frontend-release-ssh-', dir=os.environ['RUNNER_TEMP']) as folder:
        os.chmod(folder, 0o700)
        private_key, known_file = Path(folder) / 'key', Path(folder) / 'known_hosts'
        for file, value in [(private_key, os.environ['PRODUCTION_SSH_KEY'].replace('\r\n', '\n').strip() + '\n'), (known_file, known_hosts)]:
            descriptor = os.open(file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(descriptor, 'w') as stream:
                stream.write(value)
        options = ['-i', str(private_key), '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'HostKeyAlgorithms=ssh-ed25519', '-o', 'UserKnownHostsFile=' + str(known_file), '-o', 'ConnectTimeout=10', '-o', 'IPQoS=none']
        remote = user + '@' + host
        if mode == 'config':
            snapshot = validate_snapshot(json.loads(run(['ssh', *options, remote, read_config_command()])))
            (Path(os.environ['RUNNER_TEMP']) / 'frontend-source-snapshot.json').write_text(json.dumps(snapshot))
        else:
            run(['ssh', *options, remote, prepare_directory_command(target)])
            run(['scp', *options, str(archive), str(archive.with_suffix('.gz.sha256')), remote + ':' + target + '/'])
    print('Frontend ' + mode + ' complete; temporary SSH files removed')


def build_artifact():
    temporary = Path(os.environ['RUNNER_TEMP'])
    snapshot = validate_snapshot(json.loads((temporary / 'frontend-source-snapshot.json').read_text()));args = snapshot['args']
    declared = set(re.findall(r'^ARG\s+([A-Z0-9_]+)', Path('Dockerfile').read_text(), re.MULTILINE))
    assert declared == set(PUBLIC_ARGS), 'Review the public argument whitelist for this Dockerfile'
    revision = os.environ['GITHUB_SHA'];assert re.fullmatch('[0-9a-f]{40}', revision)
    version = json.loads(Path('package.json').read_text())['version'];assert re.fullmatch(r'\d+\.\d+\.\d+', version)
    run_id, attempt = os.environ['GITHUB_RUN_ID'], os.environ['GITHUB_RUN_ATTEMPT'];assert run_id.isdigit() and attempt.isdigit()
    image, container = 'frontend-ci-builder:' + run_id + '-' + attempt, 'frontend-ci-export-' + run_id + '-' + attempt
    command = ['docker', 'build', '--target', 'builder', '-t', image]
    for name, value in sorted(args.items()):
        command.extend(['--build-arg', name + '=' + value])
    if os.environ.get('GITHUB_ACTIONS') == 'true':
        for value in args.values():
            if value:print('::add-mask::' + value, flush=True)
    subprocess.run([*command, '.'], check=True)
    with tempfile.TemporaryDirectory(prefix='frontend-static-', dir=temporary) as stage:
        root = Path(stage);created = False
        try:
            run(['docker', 'create', '--name', container, '--network', 'none', '--entrypoint', '/bin/true', image]);created = True
            run(['docker', 'cp', container + ':/app/build', str(root / 'build')])
        finally:
            if created:run(['docker', 'rm', container])
        (root / 'nginx').mkdir();shutil.copyfile('nginx/frontend.conf', root / 'nginx/frontend.conf')
        shutil.copyfile('Dockerfile.runtime', root / 'Dockerfile.runtime')
        files = file_manifest(root / 'build');assert 'index.html' in files, 'Missing compiled SPA entry'
        (root / 'release.json').write_text(json.dumps({'sourceSha': revision, 'version': version, 'publicBuildArgsHash': canonical_hash(args), 'baseContainerId': snapshot['baseContainerId'], 'baseImage': snapshot['baseImage'], 'files': files}))
        archive = temporary / 'frontend-release.tar.gz'
        with tarfile.open(archive, 'w:gz') as output:
            output.add(root / 'build', arcname='build', recursive=False)
            for name, digest in sorted(files.items()):
                if snapshot['baseFiles'].get(name) != digest:
                    output.add(root / 'build' / name, arcname='build/' + name, recursive=False)
            for name in ['nginx', 'Dockerfile.runtime', 'release.json']:
                output.add(root / name, arcname=name)
        with tarfile.open(archive) as output:
            validate_members(output.getmembers())
        archive.with_suffix('.gz.sha256').write_text(archive_hash(archive) + '  frontend-release.tar.gz\n')
        print('Static frontend archive bytes: ' + str(archive.stat().st_size))


def validate_members(members):
    for member in members:
        name = PurePosixPath(member.name)
        assert not name.is_absolute() and '..' not in name.parts and '\\' not in member.name, 'Unsafe archive path'
        assert name.parts and name.parts[0] in ['build', 'nginx', 'Dockerfile.runtime', 'release.json'], 'Unexpected archive content'
        assert member.isfile() or member.isdir(), 'Archive links and special files are forbidden'


def release_directory(value):
    assert re.fullmatch('/app/aipbx-frontend-releases/[0-9]+-[0-9]+', value), 'Invalid release directory'
    folder = Path(value);assert not folder.is_symlink() and folder.resolve() == folder and folder.stat().st_uid == os.getuid(), 'Foreign release directory'
    return folder


def reject_static_links(root):
    assert root.is_dir() and not root.is_symlink()
    for directory, folders, files in os.walk(root, followlinks=False):
        for name in folders + files:
            assert not (Path(directory) / name).is_symlink(), 'Static file links are forbidden'


def file_manifest(root):
    reject_static_links(root)
    return validate_file_map({file.relative_to(root).as_posix(): archive_hash(file) for file in root.rglob('*') if file.is_file()})


def prune_static_files(root, expected):
    reject_static_links(root)
    for directory, folders, files in os.walk(root, topdown=False):
        for name in files:
            file = Path(directory) / name
            if file.relative_to(root).as_posix() not in expected:file.unlink()
        for name in folders:
            folder = Path(directory) / name
            if not any(folder.iterdir()):folder.rmdir()


def verify_artifact(directory, revision):
    folder = release_directory(directory);assert re.fullmatch('[0-9a-f]{40}', revision)
    archive = folder / 'frontend-release.tar.gz';checksum = archive.with_suffix('.gz.sha256').read_text().split()
    assert len(checksum) == 2 and checksum[1] == archive.name and checksum[0] == archive_hash(archive), 'Release checksum mismatch'
    with tarfile.open(archive) as source:
        validate_members(source.getmembers())
        metadata = json.load(source.extractfile('release.json'))
        assert metadata['sourceSha'] == revision, 'Wrong source revision'
        assert metadata['version'] == json.loads(Path('/app/aiPBX/package.json').read_text())['version'], 'Wrong release version'
        assert subprocess.check_output(['git', '-C', '/app/aiPBX', 'rev-parse', 'HEAD'], text=True).strip() == revision, 'Server source changed'
        snapshot = validate_snapshot(json.loads(subprocess.check_output(shlex.split(read_config_command()), text=True)))
        assert metadata['publicBuildArgsHash'] == canonical_hash(snapshot['args']), 'Public build configuration changed'
        assert metadata['baseContainerId'] == snapshot['baseContainerId'] and metadata['baseImage'] == snapshot['baseImage'], 'Serving frontend changed'
        expected_files = validate_file_map(metadata['files']);assert 'index.html' in expected_files
        context = folder / 'runtime';context.mkdir(mode=0o700)
        static = context / 'build';static.mkdir()
        run(['sudo', '-n', 'docker', 'cp', snapshot['baseContainerId'] + ':/usr/share/nginx/html/.', str(static)])
        reject_static_links(static)
        run(['sudo', '-n', 'chown', '-hR', str(os.getuid()) + ':' + str(os.getgid()), str(static)])
        if hasattr(tarfile, 'data_filter'):source.extractall(context, filter='data')
        else:source.extractall(context)
        prune_static_files(static, expected_files)
        assert file_manifest(static) == expected_files, 'Compiled static file manifest mismatch'
    override = 'services:\n  frontend:\n    build:\n      context: ' + json.dumps(str(context)) + '\n      dockerfile: Dockerfile.runtime\n      args:\n        SOURCE_REVISION: ' + json.dumps(revision) + '\n        APP_VERSION: ' + json.dumps(metadata['version']) + '\n'
    (folder / 'runtime.override.yml').write_text(override)
    print('Frontend source/version/configuration/checksum/archive verified')


def main():
    mode = sys.argv[1];assert mode in ['config', 'build', 'upload', 'verify', 'cleanup']
    if mode in ['config', 'upload']:ssh_operation(mode)
    elif mode == 'build':build_artifact()
    elif mode == 'verify':verify_artifact(sys.argv[2], sys.argv[3])
    else:
        folder = release_directory(sys.argv[2])
        for name in ['frontend-release.tar.gz', 'frontend-release.tar.gz.sha256']:
            file = folder / name;assert file.is_file() and not file.is_symlink();file.unlink()
        print('Transport archive removed; verified runtime context retained for rebuilds')


if __name__ == '__main__':
    main()
