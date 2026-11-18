import { useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, tokens } from '@acme/ds';

type Step = 'idle' | 'confirming' | 'deleted';

const stack = (gap: string) => ({
  display: 'flex',
  flexDirection: 'column' as const,
  gap,
});

export function TaskScreen() {
  const [step, setStep] = useState<Step>('idle');

  const handleDelete = () => {
    // Call the real account deletion API here.
    setStep('deleted');
  };

  return (
    <main
      style={{
        ...stack('var(--space-6)'),
        padding: 'var(--space-6)',
        maxWidth: 560,
        color: tokens.color.text.primary,
        background: tokens.color.surface.default,
      }}
    >
      <h1>Account settings</h1>

      <section aria-labelledby="delete-heading" style={stack('var(--space-4)')}>
        <h2 id="delete-heading">Delete account</h2>

        {step === 'idle' && (
          <>
            <p>
              Deleting your account permanently removes your profile and data.
              This can't be undone.
            </p>
            <div>
              <Button variant="destructive" onClick={() => setStep('confirming')}>
                Delete account
              </Button>
            </div>
          </>
        )}

        {step === 'confirming' && (
          <div role="alertdialog" aria-labelledby="confirm-title" style={stack('var(--space-4)')}>
            <Alert intent="warning" title="Delete your account permanently?">
              <span id="confirm-title">
                This action is permanent. Your account and all of its data will be
                deleted and can't be recovered.
              </span>
            </Alert>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={() => setStep('idle')}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Yes, delete my account
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
