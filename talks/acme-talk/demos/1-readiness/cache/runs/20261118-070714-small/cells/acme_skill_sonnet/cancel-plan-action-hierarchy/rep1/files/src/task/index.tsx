import { useState } from 'react';
import '@acme/ds/foundations.css';
import { Button, Alert, Surface, Stack, Badge } from '@acme/ds';

type Step = 'choose' | 'confirmCancel' | 'done';

export function TaskScreen() {
  const [step, setStep] = useState<Step>('choose');
  const [message, setMessage] = useState<string | null>(null);

  if (step === 'done') {
    return (
      <Surface>
        <Alert intent="success" title="Subscription cancelled">
          Your plan stays active until the end of your current billing period. You can resubscribe at any time.
        </Alert>
      </Surface>
    );
  }

  if (step === 'confirmCancel') {
    return (
      <Surface padding="space.5">
        <Stack gap="space.4">
          <Alert intent="warning" title="Cancel your subscription?">
            You'll keep access until the end of your current billing period. After that, your plan ends.
          </Alert>
          <Stack direction="row" gap="space.3">
            {/* Keeping the plan is the single primary action in this view. */}
            <Button variant="primary" onClick={() => setStep('choose')}>
              Keep my plan
            </Button>
            <Button variant="secondary" onClick={() => setStep('done')}>
              Yes, cancel subscription
            </Button>
          </Stack>
        </Stack>
      </Surface>
    );
  }

  return (
    <Surface padding="space.5">
      <Stack gap="space.5">
        <Stack gap="space.2">
          <h2>Manage your subscription</h2>
          <Stack direction="row" gap="space.2" align="center">
            <span>Current plan: Pro</span>
            <Badge label="Active" />
          </Stack>
        </Stack>

        {message && <Alert intent="success">{message}</Alert>}

        <Stack gap="space.3">
          <Surface tone="subtle" padding="space.4">
            <Stack gap="space.3">
              <Stack gap="space.1">
                <strong>Keep your current plan</strong>
                <span>Nothing changes. Your plan and billing stay as they are.</span>
              </Stack>
              <Stack direction="row" gap="space.3">
                <Button variant="primary" onClick={() => setMessage('Your plan is unchanged.')}>
                  Keep Pro plan
                </Button>
              </Stack>
            </Stack>
          </Surface>

          <Surface tone="subtle" padding="space.4">
            <Stack gap="space.3">
              <Stack gap="space.1">
                <strong>Switch to a cheaper plan</strong>
                <span>Move to Basic and pay less. You can upgrade again whenever you like.</span>
              </Stack>
              <Stack direction="row" gap="space.3">
                <Button variant="secondary" onClick={() => setMessage('You will move to Basic at your next billing date.')}>
                  Switch to Basic
                </Button>
              </Stack>
            </Stack>
          </Surface>
        </Stack>

        <Stack direction="row" gap="space.3" align="center">
          <span>Need to stop completely?</span>
          <Button variant="ghost" size="sm" onClick={() => setStep('confirmCancel')}>
            Cancel subscription
          </Button>
        </Stack>
      </Stack>
    </Surface>
  );
}
