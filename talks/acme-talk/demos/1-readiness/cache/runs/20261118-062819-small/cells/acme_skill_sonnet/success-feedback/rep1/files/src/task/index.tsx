import { useEffect, useRef, useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, tokens } from '@acme/ds';

type Prefs = { email: boolean; push: boolean; sms: boolean; digest: boolean };

const OPTIONS: { key: keyof Prefs; label: string }[] = [
  { key: 'email', label: 'Email notifications' },
  { key: 'push', label: 'Push notifications' },
  { key: 'sms', label: 'SMS notifications' },
  { key: 'digest', label: 'Weekly digest' },
];

const DISMISS_MS = 4000;

export function TaskScreen() {
  const [prefs, setPrefs] = useState<Prefs>({ email: true, push: false, sms: false, digest: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = (key: keyof Prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    // Replace with a real persistence call.
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSaving(false);
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), DISMISS_MS);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-6)',
        maxWidth: 480,
        color: tokens.color.text.primary,
        background: tokens.color.surface.default,
      }}
    >
      <h1 style={{ margin: 0 }}>Notification preferences</h1>

      <fieldset
        style={{
          border: 0,
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <legend style={{ padding: 0, marginBottom: 'var(--space-3)', color: tokens.color.text.primary }}>
          Choose how you want to hear from us
        </legend>
        {OPTIONS.map(({ key, label }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input type="checkbox" checked={prefs[key]} onChange={() => toggle(key)} />
            {label}
          </label>
        ))}
      </fieldset>

      <div>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save preferences'}
        </Button>
      </div>

      {/* Live region stays mounted so screen readers announce the message; it never blocks interaction. */}
      <div role="status" aria-live="polite">
        {saved && (
          <Alert intent="success" title="Preferences saved">
            Your notification settings have been updated.
          </Alert>
        )}
      </div>
    </form>
  );
}
