import { IntegrationType, UserIntegration } from '@prisma/client'
import { syncSlackIntegration } from './slack'

export const INTEGRATION_SYNC_FUNCTIONS: Record<IntegrationType, (userIntegration: UserIntegration) => Promise<void>> =
  {
    SLACK: syncSlackIntegration,
  }
