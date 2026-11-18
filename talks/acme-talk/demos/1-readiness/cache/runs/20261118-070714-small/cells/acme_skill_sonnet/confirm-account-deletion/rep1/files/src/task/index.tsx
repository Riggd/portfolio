import { useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, Input, Stack, Surface, tokens } from '@acme/ds';

const CONFIRM_PHRASE = 'DELETE';

export function TaskScreen() {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [deleted, setDeleted] = useState(false);

  const matches = typed.trim() === CONFIRM_PHRASE;

  const cancel = () => {
    setConfirming(false);
    setTyped('');
  };

  const deleteAccount = () => {
    if (!matches) return;
    // Hook up the real account deletion request here.
    setDeleted(true);
    setConfirming(false);
    setTyped('');
  };

  if (deleted) {
    return (
      <Alert intent="success" title="Account deleted">
        Your account and all its data have been permanently deleted.
      </Alert>
    );
  }

  return (
    <Stack gap="space.5">
      <h1 style={{ color: tokens.color.text.primary }}>Account settings</h1>

      <Surface>
        <Stack gap="space.4">
          <h2 style={{ color: tokens.color.text.primary }}>Delete account</h2>
          <p style={{ color: tokens.color.text.secondary }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </p>

          {!confirming ? (
            <Stack direction="row">
              <Button variant="destructive" onClick={() => setConfirming(true)}>
                Delete account
              </Button>
            </Stack>
          ) : (
            <Surface tone="subtle" padding="space.5">
              <Stack gap="space.4">
                <Alert intent="warning" title="This action is permanent">
                  Your account and all your data will be deleted and cannot be recovered.
                </Alert>
                <Input
                  label={`Type ${CONFIRM_PHRASE} to confirm`}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                />
                <Stack direction="row" gap="space.3">
                  <Button variant="secondary" onClick={cancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={deleteAccount}
                    disabled={!matches}
                  >
                    Permanently delete account
                  </Button>
                </Stack>
              </Stack>
            </Surface>
          )}
        </Stack>
      </Surface>
    </Stack>
  );
}
