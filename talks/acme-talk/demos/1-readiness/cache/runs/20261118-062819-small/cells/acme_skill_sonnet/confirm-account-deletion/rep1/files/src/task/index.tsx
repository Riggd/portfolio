import { useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, tokens } from '@acme/ds';

const CONFIRM_PHRASE = 'DELETE';

export function TaskScreen() {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [deleted, setDeleted] = useState(false);

  const canDelete = typed === CONFIRM_PHRASE;

  const cancel = () => {
    setConfirming(false);
    setTyped('');
  };

  const deleteAccount = () => {
    if (!canDelete) return;
    // Hook up the real deletion request here.
    setDeleted(true);
    setConfirming(false);
    setTyped('');
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-6)',
        maxWidth: 640,
        color: tokens.color.text.primary,
        background: tokens.color.surface.default,
      }}
    >
      <h1>Account settings</h1>

      <section
        aria-labelledby="delete-account-heading"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <h2 id="delete-account-heading">Delete account</h2>
        <p>
          Permanently delete your account and all of its data. This can't be undone.
        </p>

        {deleted && (
          <Alert intent="success" title="Account deleted">
            Your account has been permanently deleted.
          </Alert>
        )}

        {!confirming && !deleted && (
          <div>
            <Button variant="destructive" onClick={() => setConfirming(true)}>
              Delete account
            </Button>
          </div>
        )}

        {confirming && (
          <div
            role="alertdialog"
            aria-labelledby="confirm-delete-title"
            aria-describedby="confirm-delete-desc"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <Alert intent="warning" title="This action is permanent">
              <span id="confirm-delete-desc">
                Your profile, data and settings will be deleted immediately and cannot be
                recovered.
              </span>
            </Alert>

            <h3 id="confirm-delete-title">Are you sure you want to delete your account?</h3>

            <label
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
            >
              <span>
                Type <strong>{CONFIRM_PHRASE}</strong> to confirm
              </span>
              <input
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoFocus
                style={{
                  padding: 'var(--space-3)',
                  color: tokens.color.text.primary,
                  background: tokens.color.surface.default,
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={cancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteAccount} disabled={!canDelete}>
                Permanently delete account
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
