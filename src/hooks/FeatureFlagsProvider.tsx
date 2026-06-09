import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  FeatureFlagsContext,
  featureFlagDefinitions,
  type FeatureFlagId,
  type FeatureFlagsContextValue,
  type FeatureFlagsState,
} from './featureFlagsContext'

interface FeatureFlagsProviderProps {
  children: ReactNode
}

const featureFlagsStorageKey = 'pitaquinho:feature-flags'

const getDefaultFeatureFlags = () => (
  featureFlagDefinitions.reduce((accumulator, definition) => {
    accumulator[definition.id] = definition.defaultEnabled
    return accumulator
  }, {} as FeatureFlagsState)
)

const readStoredFeatureFlags = () => {
  const defaultFlags = getDefaultFeatureFlags()

  try {
    const storedValue = window.localStorage.getItem(featureFlagsStorageKey)
    if (!storedValue) return defaultFlags

    const parsedValue = JSON.parse(storedValue) as Partial<Record<FeatureFlagId, unknown>>

    return featureFlagDefinitions.reduce((accumulator, definition) => {
      const storedFlagValue = parsedValue[definition.id]
      accumulator[definition.id] = typeof storedFlagValue === 'boolean'
        ? storedFlagValue
        : definition.defaultEnabled

      return accumulator
    }, {} as FeatureFlagsState)
  } catch {
    return defaultFlags
  }
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlagsState>(readStoredFeatureFlags)

  useEffect(() => {
    window.localStorage.setItem(featureFlagsStorageKey, JSON.stringify(flags))
  }, [flags])

  const setFeatureFlag = useCallback((flagId: FeatureFlagId, enabled: boolean) => {
    setFlags((currentFlags) => ({
      ...currentFlags,
      [flagId]: enabled,
    }))
  }, [])

  const toggleFeatureFlag = useCallback((flagId: FeatureFlagId) => {
    setFlags((currentFlags) => ({
      ...currentFlags,
      [flagId]: !currentFlags[flagId],
    }))
  }, [])

  const isFeatureEnabled = useCallback((flagId: FeatureFlagId) => flags[flagId], [flags])

  const value = useMemo<FeatureFlagsContextValue>(() => ({
    flags,
    definitions: featureFlagDefinitions,
    setFeatureFlag,
    toggleFeatureFlag,
    isFeatureEnabled,
  }), [flags, isFeatureEnabled, setFeatureFlag, toggleFeatureFlag])

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}
