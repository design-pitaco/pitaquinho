import { CalendarSection } from '../CalendarSection'
import type { LiveEventOpenPayload } from '../../pages/LiveEventPage'

interface CompetitionPageProps {
  sport: string
  competitionId: string
  liveOnly?: boolean
  onLiveMatchClick?: (payload: LiveEventOpenPayload) => void
}

export function CompetitionPage({ sport, competitionId, liveOnly = false, onLiveMatchClick }: CompetitionPageProps) {
  return (
    <CalendarSection
      sportFilter={sport}
      competitionId={competitionId}
      liveOnly={liveOnly}
      onLiveMatchClick={onLiveMatchClick}
    />
  )
}
