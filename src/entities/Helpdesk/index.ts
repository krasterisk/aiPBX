export type {
    HelpdeskTicket,
    HelpdeskTicketStatus,
    HelpdeskTicketCategory,
    HelpdeskTicketPriority,
    HelpdeskLlmContext,
    HelpdeskSettings,
    AlfawebhookClient,
    HelpdeskIdentifyResult,
} from './model/types/helpdesk'
export { resolveHelpdeskClientKey } from './model/types/helpdesk'
export {
    useGetHelpdeskTicketsQuery,
    useGetHelpdeskTicketByIdQuery,
    useCreateHelpdeskTicketMutation,
    useIdentifyHelpdeskClientMutation,
    useUpdateHelpdeskTicketMutation,
    useClaimHelpdeskTicketMutation,
    useAddHelpdeskMessageMutation,
    useGetHelpdeskSettingsQuery,
    useUpdateHelpdeskSettingsMutation,
    useGetHelpdeskLlmContextQuery,
    useUpdateHelpdeskLlmContextOverrideMutation,
} from './api/helpdeskApi'
export { HelpdeskTicketTable } from './ui/HelpdeskTicketTable/HelpdeskTicketTable'
export { HelpdeskTicketKanban } from './ui/HelpdeskTicketKanban/HelpdeskTicketKanban'
export { HelpdeskLlmContextTabs } from './ui/HelpdeskLlmContextTabs/HelpdeskLlmContextTabs'
export { CreateHelpdeskTicketModal } from './ui/CreateHelpdeskTicketModal/CreateHelpdeskTicketModal'
