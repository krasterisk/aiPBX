import { ReportEvent } from '../model/types/report'

export const useReportDialog = (events: ReportEvent[]) => {
  return events
    .filter(e =>
      e.type === 'conversation.item.input_audio_transcription.completed' ||
          e.type === 'response.done'
    )
    .flatMap(e => {
      if (e.type === 'conversation.item.input_audio_transcription.completed') {
        return [{ role: 'User', text: e.transcript }]
      }

      if (e.type === 'response.done') {
        const items = e.response?.output || []
        return items.flatMap((item: any) =>
          item?.content?.map((c: any) => ({ role: 'Assistant', text: c.transcript })) || []
        )
      }

      return []
    })
}
