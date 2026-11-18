import { useEffect, useState } from 'react';
import { Alert } from '@acme/ds';

type SyncStatus = 'online' | 'reconnecting' | 'offline';
type Health = 'operational' | 'degraded' | 'down';
type Intent = 'success' | 'warning' | 'danger';

interface Integration {
  id: string;
  name: string;
  health: Health;
}

const SYNC_INTENT: Record<SyncStatus, Intent> = {
  online: 'success',
  reconnecting: 'warning',
  offline: 'danger',
};

const SYNC_COPY: Record<SyncStatus, { title: string; body: string }> = {
  online: { title: 'Sync online', body: 'Background sync is running normally.' },
  reconnecting: { title: 'Sync reconnecting', body: 'Trying to restore background sync…' },
  offline: { title: 'Sync offline', body: 'Changes will sync once the connection is restored.' },
};

const HEALTH_INTENT: Record<Health, Intent> = {
  operational: 'success',
  degraded: 'warning',
  down: 'danger',
};

const HEALTH_LABEL: Record<Health, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const INTEGRATIONS: Integration[] = [
  { id: 'slack', name: 'Slack', health: 'operational' },
  { id: 'github', name: 'GitHub', health: 'degraded' },
  { id: 'salesforce', name: 'Salesforce', health: 'down' },
];

function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online',
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const goOffline = () => {
      clearTimeout(timer);
      setStatus('offline');
    };
    const goOnline = () => {
      setStatus('reconnecting');
      timer = setTimeout(() => setStatus('online'), 1500);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return status;
}

export function TaskScreen() {
  const sync = useSyncStatus();
  const copy = SYNC_COPY[sync];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-5)',
      }}
    >
      <div role="status" aria-live="polite">
        <Alert intent={SYNC_INTENT[sync]} title={copy.title}>
          {copy.body}
        </Alert>
      </div>

      <section
        aria-labelledby="integrations-heading"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <h2 id="integrations-heading" style={{ margin: 0, color: 'var(--color-text-primary)' }}>
          Integrations
        </h2>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {INTEGRATIONS.map((i) => (
            <li key={i.id}>
              <Alert intent={HEALTH_INTENT[i.health]} title={i.name}>
                {HEALTH_LABEL[i.health]}
              </Alert>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
