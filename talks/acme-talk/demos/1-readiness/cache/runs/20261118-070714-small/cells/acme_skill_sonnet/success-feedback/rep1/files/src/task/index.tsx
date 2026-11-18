import { useEffect, useState } from 'react';
import '@acme/ds/foundations.css';
import { Alert, Button, Chip, Input, Stack, Surface } from '@acme/ds';

const TOPICS = ['Product updates', 'Security alerts', 'Billing', 'Weekly digest'];
const DISMISS_MS = 4000;

export function TaskScreen() {
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<string[]>(['Security alerts']);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Success feedback is transient: it clears itself and never blocks the UI.
  useEffect(() => {
    if (!saved) return;
    const id = setTimeout(() => setSaved(false), DISMISS_MS);
    return () => clearTimeout(id);
  }, [saved]);

  const toggle = (topic: string, selected: boolean) => {
    setSaved(false);
    setTopics((prev) =>
      selected ? [...prev, topic] : prev.filter((t) => t !== topic),
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Placeholder for the real save request.
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSaving(false);
    setSaved(true);
  };

  return (
    <Surface>
      <form onSubmit={onSubmit}>
        <Stack gap="space.5">
          <Input
            label="Notification email"
            type="email"
            value={email}
            onChange={(e) => {
              setSaved(false);
              setEmail(e.target.value);
            }}
          />
          <Stack direction="row" gap="space.2">
            {TOPICS.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                selected={topics.includes(topic)}
                onToggle={(selected) => toggle(topic, selected)}
              />
            ))}
          </Stack>
          <Stack direction="row" gap="space.3" align="center">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save preferences'}
            </Button>
          </Stack>
          {/* Live region stays mounted so screen readers announce the message. */}
          <div role="status" aria-live="polite">
            {saved && (
              <Alert intent="success" title="Preferences saved">
                Your notification preferences have been updated.
              </Alert>
            )}
          </div>
        </Stack>
      </form>
    </Surface>
  );
}
