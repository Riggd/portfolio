import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './foundations.css';
import { Alert, Badge, Button, Chip, Input, Stack, Surface } from './index';

const noop = () => {};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <main style={{ padding: 'var(--space-6)', maxWidth: 640 }}>
        <Stack gap="space.4">
          <Stack direction="row" gap="space.2">
            <Button variant="primary">Save</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="destructive">Delete account</Button>
            <Button variant="ghost">Edit</Button>
          </Stack>
          <Alert intent="success" title="Saved">Your changes are live.</Alert>
          <Alert intent="warning" title="Heads up">Your trial ends in 3 days.</Alert>
          <Alert intent="danger" title="Payment failed">Update your card to keep your plan.</Alert>
          <Input label="Workspace name" hint="Shown to everyone in your team." />
          <Input label="Email" type="email" defaultValue="sam@" error="Enter a valid email address." />
          <Surface tone="default">
            <Stack direction="row" gap="space.2" align="center">
              <Badge label="3 new" />
              <Chip label="Design" onRemove={noop} />
              <Chip label="Open" selected onToggle={noop} />
              <Chip label="Closed" selected={false} onToggle={noop} />
            </Stack>
          </Surface>
          <Surface tone="subtle" padding="space.4">Subtle surface</Surface>
          <Surface tone="tinted" padding="space.6">Tinted surface</Surface>
        </Stack>
      </main>
    </StrictMode>,
  );
}
