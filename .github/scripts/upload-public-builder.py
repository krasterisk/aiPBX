"""Send only the pinned public builder cache; credentials exist in temporary files only."""
import base64
import hashlib
import os
from pathlib import Path
import re
import subprocess
import tempfile

HOST_FINGERPRINT = 'SHA256:08WKSfiu4Dpx5QXU2MIe+rT8J5ijk7hTzEVsIsS+ehw'


def validate_target(host, user, run, attempt):
    assert re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?', host), 'Invalid host'
    assert re.fullmatch(r'[A-Za-z_][A-Za-z0-9_-]{0,31}', user), 'Invalid user'
    assert run.isdigit() and attempt.isdigit(), 'Invalid run'
    return '/tmp/aipbx-frontend-builder-' + run + '-' + attempt


def verified_host_keys(output, expected=HOST_FINGERPRINT):
    records = [line for line in output.splitlines() if line and not line.startswith('#')]
    assert records, 'No SSH host key'
    for line in records:
        fields = line.split()
        assert len(fields) == 3 and fields[1] == 'ssh-ed25519', 'Unexpected host key'
        fingerprint = 'SHA256:' + base64.b64encode(hashlib.sha256(base64.b64decode(fields[2], validate=True)).digest()).decode().rstrip('=')
        assert fingerprint == expected, 'Production SSH host key mismatch'
    return '\n'.join(sorted(set(records))) + '\n'


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=900)
    if result.returncode:
        raise RuntimeError('Public cache transfer command failed')
    return result.stdout


def main():
    host, user = os.environ['PRODUCTION_HOST'], os.environ['PRODUCTION_USER']
    target = validate_target(host, user, os.environ['GITHUB_RUN_ID'], os.environ['GITHUB_RUN_ATTEMPT'])
    archive = Path(os.environ['RUNNER_TEMP']) / 'public-frontend-builder.tar.gz'
    checksum = archive.with_suffix(archive.suffix + '.sha256')
    assert archive.is_file() and checksum.is_file(), 'Missing public builder archive'
    known_hosts = verified_host_keys(run(['ssh-keyscan', '-T', '10', '-t', 'ed25519', host]))
    with tempfile.TemporaryDirectory(prefix='public-builder-ssh-', dir=os.environ['RUNNER_TEMP']) as folder:
        os.chmod(folder, 0o700)
        private_key, known_file = Path(folder) / 'key', Path(folder) / 'known_hosts'
        for file, value in [(private_key, os.environ['PRODUCTION_SSH_KEY'].replace('\r\n', '\n').strip() + '\n'), (known_file, known_hosts)]:
            descriptor = os.open(file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(descriptor, 'w') as stream:
                stream.write(value)
        options = ['-i', str(private_key), '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'HostKeyAlgorithms=ssh-ed25519', '-o', 'UserKnownHostsFile=' + str(known_file), '-o', 'ConnectTimeout=10']
        remote = user + '@' + host
        run(['ssh', *options, remote, 'mkdir -m 700 ' + target])
        run(['scp', *options, str(archive), str(checksum), remote + ':' + target + '/'])
    print('Pinned public builder cache uploaded; temporary SSH files removed')


if __name__ == '__main__':
    main()
