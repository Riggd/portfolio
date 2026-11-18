import { useState } from 'react';
import { Surface, Stack, tokens } from '@acme/ds';

type SettingKey = 'emailDigests' | 'pushAlerts' | 'productAnnouncements';

const SETTINGS: { key: SettingKey; label: string; description: string }[] = [
  {
    key: 'emailDigests',
    label: 'Email digests',
    description: 'A periodic summary of activity sent to your inbox.',
  },
  {
    key: 'pushAlerts',
    label: 'Push alerts',
    description: 'Real-time notifications on your devices.',
  },
  {
    key: 'productAnnouncements',
    label: 'Product announcements',
    description: 'News about new features and improvements.',
  },
];

export function TaskScreen() {
  // Each change applies immediately; no save step.
  const [values, setValues] = useState<Record<SettingKey, boolean>>({
    emailDigests: true,
    pushAlerts: true,
    productAnnouncements: false,
  });

  return (
    <Surface>
      <section aria-labelledby="notification-prefs-heading">
        <Stack gap="space.5">
          <h2
            id="notification-prefs-heading"
            style={{ margin: 0, color: tokens.color.text.primary }}
          >
            Notification preferences
          </h2>
          <Stack gap="space.4">
            {SETTINGS.map(({ key, label, description }) => {
              const id = `notif-${key}`;
              return (
                <Stack key={key} direction="row" gap="space.4" align="center">
                  <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    checked={values[key]}
                    aria-describedby={`${id}-desc`}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                  />
                  <Stack gap="space.1">
                    <label
                      htmlFor={id}
                      style={{ color: tokens.color.text.primary }}
                    >
                      {label}
                    </label>
                    <span
                      id={`${id}-desc`}
                      style={{ color: tokens.color.text.secondary }}
                    >
                      {description}
                    </span>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </section>
    </Surface>
  );
}
