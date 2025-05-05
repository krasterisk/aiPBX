import { useMemo } from 'react'
import { GroupedReport, Report } from '../model/types/report'

export const useGroupedReportsByChannelId = (reports?: Report[]): GroupedReport[] => {
  return useMemo(() => {
    if (!reports?.length) return []

    const map = new Map<string, Report[]>()

    for (const report of reports) {
      const key = report.channelId
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(report)
    }

    return Array.from(map.entries()).map(([channelId, group]) => {
      const [first] = group

      return {
        id: first.id,
        channelId,
        callerId: first.callerId,
        createdAt: first.createdAt,
        userId: first.userId,
        event: group.flatMap(r => r.event ? [r.event] : [])
      }
    })
  }, [reports])
}
