import { useState } from 'react';
import type { FormEvent } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, Input, Stack, Surface } from '@acme/ds';

const CONFIRM_PHRASE = 'DELETE';

type Step = 'idle' | 'confirming' | 'deleted';

export function TaskScreen() {
  const [step, setStep] = useState<Step>('idle');
  const [typed, setTyped] = useState('');
  const [touched, setTouched] = useState(false);

  const matches = typed === CONFIRM_PHRASE;
  const error = touched && !matches ? `Type ${CONFIRM_PHRASE} exactly to continue.` : undefined;

  function cancel() {
    setStep('idle');
    setTyped('');
    setTouched(false);
  }

  function confirm(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!matches) return;
    // Hook up the real deletion request here.
    setStep('deleted');
  }

  if (step === 'deleted') {
    return (
      <Surface padding="space.6">
        <Alert intent="success" title="Account deleted">
          Your account and its data have been permanently deleted.
        </Alert>
      </Surface>
    );
  }

  return (
    <Surface padding="space.6">
      <Stack gap="space.6">
        <h1>Account settings</h1>

        <Surface tone="subtle">
          <Stack gap="space.4" align="start">
            <h2>Delete account</h2>
            <p>
              Permanently delete your account and all of its data. This can't be undone.
            </p>

            {step === 'idle' ? (
              <Button variant="destructive" onClick={() => setStep('confirming')}>
                Delete account…
              </Button>
            ) : (
              <form onSubmit={confirm} noValidate aria-label="Confirm account deletion">
                <Stack gap="space.4">
                  <Alert intent="warning" title="This is permanent">
                    Deleting your account removes your profile, settings and all saved data. We
                    can't recover it afterwards.
                  </Alert>
                  <Input
                    label={`Type ${CONFIRM_PHRASE} to confirm`}
                    value={typed}
                    error={error}
                    hint={error ? undefined : 'This helps make sure you don’t delete by accident.'}
                    autoComplete="off"
                    autoFocus
                    onChange={(e) => setTyped(e.target.value)}
                    onBlur={() => setTouched(true)}
                  />
                  <Stack direction="row" gap="space.3">
                    <Button variant="secondary" onClick={cancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="destructive" disabled={!matches}>
                      Permanently delete account
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
          </Stack>
        </Surface>
      </Stack>
    </Surface>
  );
}
