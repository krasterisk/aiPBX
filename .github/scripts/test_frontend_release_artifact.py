import importlib.util
import os
from pathlib import Path
import shlex
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('release', Path(__file__).with_name('frontend-release-artifact.py'))
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class ReleaseTransportTests(unittest.TestCase):
    def test_transient_connection_retries_without_leaking_stderr(self):
        responses = [subprocess.CompletedProcess([], 255, '', 'Connection reset: private data'),
                     subprocess.CompletedProcess([], 0, 'ok', '')]
        with patch.object(release.subprocess, 'run', side_effect=responses) as run, patch.object(release.time, 'sleep') as sleep:
            self.assertEqual(release.run(['ssh', 'target', 'true']), 'ok')
            self.assertEqual(run.call_count, 2)
            sleep.assert_called_once_with(5)

    def test_authentication_and_host_key_errors_are_never_retried(self):
        for message in ['Permission denied private data', 'Host key verification failed private data']:
            with patch.object(release.subprocess, 'run', return_value=subprocess.CompletedProcess([], 255, '', message)) as run:
                with self.assertRaisesRegex(RuntimeError, 'authentication_or_host_key') as error:
                    release.run(['ssh', 'target', 'true'])
                self.assertNotIn('private data', str(error.exception))
                self.assertEqual(run.call_count, 1)

    def test_remote_command_failure_is_not_retried(self):
        with patch.object(release.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1, '', 'private data')) as run:
            with self.assertRaisesRegex(RuntimeError, 'remote_command'):
                release.run(['ssh', 'target', 'command'])
            self.assertEqual(run.call_count, 1)

    def test_directory_preparation_is_idempotent_only_for_its_owned_target(self):
        with tempfile.TemporaryDirectory() as folder:
            parent = Path(folder)
            (parent / '.owner').write_text('frontend-actions-artifacts-v1')
            target = parent / '123-1'
            code = shlex.split(release.prepare_directory_command(str(target)))[2]
            code = code.replace("'/app/aipbx-frontend-releases'", repr(str(parent)))
            with patch.object(os, 'getuid', return_value=parent.stat().st_uid, create=True):
                exec(code, {})
                exec(code, {})
                (target / '.owner').write_text('foreign')
                with self.assertRaises(AssertionError):
                    exec(code, {})


if __name__ == '__main__':
    unittest.main()
