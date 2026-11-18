import '@acme/ds/foundations.css';
import { Alert, Badge, Stack, Surface } from '@acme/ds';

type SyncState = 'online' | 'reconnecting' | 'offline';
type Health = 'operational' | 'degraded' | 'down';

interface Integration {
  id: string;
  name: string;
  health: Health;
}

const syncState: SyncState = 'online';

const integrations: Integration[] = [
  { id: 'slack', name: 'Slack', health: 'operational' },
  { id: 'github', name: 'GitHub', health: 'degraded' },
  { id: 'calendar', name: 'Calendar', health: 'down' },
];

const syncDisplay = {
  online: {
    intent: 'success',
    title: 'Sync online',
    message: 'Background sync is running normally.',
  },
  reconnecting: {
    intent: 'warning',
    title: 'Sync reconnecting',
    message: 'Trying to restore background sync. Changes will sync once reconnected.',
  },
  offline: {
    intent: 'danger',
    title: 'Sync offline',
    message: 'Background sync is unavailable. Changes are not being synced.',
  },
} as const;

const healthLabel: Record<Health, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

export function TaskScreen() {
  const sync = syncDisplay[syncState];

  return (
    <Stack gap="space.5">
      <div role="status" aria-live="polite">
        <Alert intent={sync.intent} title={sync.title}>
          {sync.message}
        </Alert>
      </div>

      <Surface>
        <Stack gap="space.4">
          <h2>Integrations</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {integrations.map((integration) => (
              <li key={integration.id}>
                <Stack direction="row" gap="space.3" align="center">
                  <span>{integration.name}</span>
                  <Badge label={healthLabel[integration.health]} />
                </Stack>
              </li>
            ))}
          </ul>
        </Stack>
      </Surface>
    </Stack>
  );
}
