import { rtkApi } from '@/shared/api/rtkApi'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import type { OrganizationDocument } from '../model/types/organizationDocument'

export interface CreateInvoiceBody {
    amountRub: number
    subject?: string | null
    /** Admin only: issuer our-organization for this invoice */
    ourOrganizationId?: number | null
    /** Create draft in EDO; default false — local PDF only */
    sendViaEdo?: boolean
}

export interface CreateInvoiceResponse {
    documentId: string
    number: string
    pdfUrl: string
    paymentPurpose: string
    subject: string
}

export interface DefaultSubjectResponse {
    defaultSubject: string
}

const organizationDocumentApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getOrganizationDefaultSubject: build.query<DefaultSubjectResponse, void>({
            query: () => ({ url: '/organizations/default-subject', method: 'GET' }),
        }),
        createOrganizationInvoice: build.mutation<
            CreateInvoiceResponse,
            { organizationId: string, body: CreateInvoiceBody }
        >({
            query: ({ organizationId, body }) => ({
                url: `/organizations/${organizationId}/invoices`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Organization', 'OrganizationDocument'],
        }),
        getOrganizationDocuments: build.query<OrganizationDocument[], string>({
            query: (organizationId) => ({
                url: `/organizations/${organizationId}/documents`,
                method: 'GET',
            }),
            providesTags: (_res, _err, organizationId) => [
                { type: 'OrganizationDocument', id: organizationId },
            ],
        }),
        deleteOrganizationDocument: build.mutation<
            void,
            { organizationId: string, documentId: string }
        >({
            query: ({ organizationId, documentId }) => ({
                url: `/organizations/${organizationId}/documents/${encodeURIComponent(documentId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: 'OrganizationDocument', id: arg.organizationId },
            ],
        }),
    }),
})

export const {
    useGetOrganizationDefaultSubjectQuery,
    useCreateOrganizationInvoiceMutation,
    useGetOrganizationDocumentsQuery,
    useDeleteOrganizationDocumentMutation,
} = organizationDocumentApi

/**
 * Build absolute API URL. If `__API__` already ends with `/api`, strips a duplicate `/api` prefix from `path`.
 */
export function joinApiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    if (typeof __API__ !== 'undefined' && __API__) {
        const base = String(__API__).replace(/\/$/, '')
        if (base.endsWith('/api') && normalizedPath.startsWith('/api/')) {
            return `${base}${normalizedPath.slice(4)}`
        }
        return `${base}${normalizedPath}`
    }
    return normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Handles string, Buffer JSON, Sequelize-shaped rows, or nested id from API/ORM. */
export function normalizeDocumentId(raw: unknown): string {
    if (raw == null) return ''
    if (typeof raw === 'string') return raw.trim()
    if (typeof raw === 'number' && Number.isFinite(raw)) return String(Math.trunc(raw))
    if (typeof raw === 'bigint') return raw.toString()
    if (typeof raw === 'object' && raw !== null) {
        const o = raw as Record<string, unknown>
        if (o.type === 'Buffer' && Array.isArray(o.data)) {
            const bytes = Uint8Array.from(o.data as number[])
            const utf = new TextDecoder().decode(bytes).trim()
            if (UUID_RE.test(utf)) return utf
            if (bytes.length === 16) {
                const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
                return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
            }
            return utf
        }
        if (o.dataValues != null && typeof o.dataValues === 'object') {
            return normalizeDocumentId((o.dataValues as Record<string, unknown>).id)
        }
        if ('id' in o && o.id !== raw) {
            return normalizeDocumentId(o.id)
        }
        try {
            const flat = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>
            for (const v of Object.values(flat)) {
                if (typeof v === 'string' && UUID_RE.test(v)) return v
            }
        } catch {
            /* noop */
        }
    }
    return ''
}

export function getOrganizationDocumentPdfUrl(organizationId: string, documentId: unknown): string {
    const docId = normalizeDocumentId(documentId)
    const path = `/organizations/${String(organizationId)}/documents/${encodeURIComponent(docId)}/pdf`
    return joinApiUrl(path)
}

function resolveFetchUrl(href: string): string {
    if (href.startsWith('http://') || href.startsWith('https://')) {
        return href
    }
    if (href.startsWith('/')) {
        return `${window.location.origin}${href}`
    }
    return href
}

/**
 * Fetches PDF with Bearer token and opens in a new tab.
 * Use instead of window.open(url) — navigation does not send Authorization.
 */
export async function openPdfUrlWithAuth(href: string): Promise<void> {
    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
    const url = resolveFetchUrl(href)
    const headers: HeadersInit = {}
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(url, { headers })
    if (!res.ok) {
        throw new Error(`PDF request failed: ${res.status}`)
    }
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    window.open(objectUrl, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => { URL.revokeObjectURL(objectUrl) }, 120_000)
}

export async function openOrganizationDocumentPdf(organizationId: string, documentId: unknown): Promise<void> {
    const docId = normalizeDocumentId(documentId)
    if (!docId) {
        throw new Error('Invalid document id')
    }
    await openPdfUrlWithAuth(getOrganizationDocumentPdfUrl(organizationId, docId))
}
