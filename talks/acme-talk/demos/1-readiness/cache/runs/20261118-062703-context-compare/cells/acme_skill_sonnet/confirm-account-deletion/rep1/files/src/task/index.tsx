import { useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, tokens } from '@acme/ds';

type Step = 'idle' | 'confirming' | 'deleted';

export function TaskScreen() {
  const [step, setStep] = useState<Step>('idle');
  const [understood, setUnderstood] = useState(false);

  const cancel = () => {
    setUnderstood(false);
    setStep('idle');
  };

  const deleteAccount = () => {
    // Hook up to the real account-deletion call here.
    setStep('deleted');
  };

  const stack = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  } as const;
  const row = {
    display: 'flex',
    gap: 'var(--space-3)',
  } as const;

  return (
    <main
      style={{
        ...stack,
        maxWidth: 560,
        padding: 'var(--space-6)',
        background: tokens.color.surface.default,
        color: tokens.color.text.primary,
      }}
    >
      <h1>Account settings</h1>

      <section style={stack} aria-labelledby="delete-heading">
        <h2 id="delete-heading">Delete account</h2>
        <p style={{ color: tokens.color.text.secondary }}>
          Permanently delete your account and all of its data.
        </p>

        {step === 'idle' && (
          <div>
            <Button variant="destructive" onClick={() => setStep('confirming')}>
              Delete account
            </Button>
          </div>
        )}

        {step === 'confirming' && (
          <div role="alertdialog" aria-labelledby="confirm-title" style={stack}>
            <Alert intent="warning" title="This can't be undone">
              <span id="confirm-title">
                Deleting your account permanently removes your profile and data. We
                can't recover it afterwards.
              </span>
            </Alert>
            <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
              />
              I understand my account will be permanently deleted.
            </label>
            <div style={row}>
              <Button variant="secondary" onClick={cancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteAccount} disabled={!understood}>
                Permanently delete account
              </Button>
            </div>
          </div>
        )}

        {step === 'deleted' && (
          <Alert intent="success" title="Account deleted">
            Your account has been permanently deleted.
          </Alert>
        )}
      </section>
    </main>
  );
}
