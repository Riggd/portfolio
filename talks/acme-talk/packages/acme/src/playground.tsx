import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './foundations.css';
import { Alert, Button } from './index';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <main style={{ display: 'grid', gap: 'var(--space-4)', padding: 'var(--space-6)', maxWidth: 640 }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="destructive">Delete account</Button>
          <Button variant="ghost">Edit</Button>
        </div>
        <Alert intent="success" title="Saved">Your changes are live.</Alert>
        <Alert intent="warning" title="Heads up">Your trial ends in 3 days.</Alert>
        <Alert intent="danger" title="Payment failed">Update your card to keep your plan.</Alert>
      </main>
    </StrictMode>,
  );
}
