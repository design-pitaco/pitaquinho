import { createContext } from 'react'

export type FeatureFlagId = 'freeBetsAvailable'

export interface FeatureFlagDefinition {
  id: FeatureFlagId
  title: string
  description: string
  defaultEnabled: boolean
}

export const featureFlagDefinitions: FeatureFlagDefinition[] = [
  {
    id: 'freeBetsAvailable',
    title: 'Apostas Gratis disponivel',
    description: 'Ativa a experiencia em prototipo de Apostas Gratis.',
    defaultEnabled: true,
  },
]

export type FeatureFlagsState = Record<FeatureFlagId, boolean>

export interface FeatureFlagsContextValue {
  flags: FeatureFlagsState
  definitions: FeatureFlagDefinition[]
  setFeatureFlag: (flagId: FeatureFlagId, enabled: boolean) => void
  toggleFeatureFlag: (flagId: FeatureFlagId) => void
  isFeatureEnabled: (flagId: FeatureFlagId) => boolean
}

export const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null)
