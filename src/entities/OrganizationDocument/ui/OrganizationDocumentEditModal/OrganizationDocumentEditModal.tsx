import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/mui/Input'
import {
    useUpdateOrganizationDocumentMutation,
} from '../../api/organizationDocumentApi'
import type { OrganizationDocument } from '../../model/types/organizationDocument'

interface OrganizationDocumentEditModalProps {
    isOpen: boolean
    onClose: () => void
    organizationId: string
    document: OrganizationDocument | null
}

function normalizeDateInput(value: string | null | undefined): string {
    if (!value) return ''
    return value.slice(0, 10)
}

export const OrganizationDocumentEditModal = memo((props: OrganizationDocumentEditModalProps) => {
    const { isOpen, onClose, organizationId, document } = props
    const { t } = useTranslation('payment')
    const [updateDocument, { isLoading }] = useUpdateOrganizationDocumentMutation()

    const [number, setNumber] = useState('')
    const [documentDate, setDocumentDate] = useState('')
    const [amountRub, setAmountRub] = useState('')

    useEffect(() => {
        if (!isOpen || !document) return
        setNumber(document.number || '')
        setDocumentDate(normalizeDateInput(document.documentDate))
        setAmountRub(String(document.amountRub ?? ''))
    }, [isOpen, document])

    const handleClose = useCallback(() => {
        if (!isLoading) {
            onClose()
        }
    }, [isLoading, onClose])

    const parsedAmount = parseFloat(amountRub.replace(',', '.'))
    const canSubmit = Boolean(
        document &&
        number.trim() &&
        /^\d{4}-\d{2}-\d{2}$/.test(documentDate) &&
        Number.isFinite(parsedAmount) &&
        parsedAmount > 0,
    )

    const handleSubmit = useCallback(async () => {
        if (!document || !canSubmit) return
        try {
            await updateDocument({
                organizationId,
                documentId: document.id,
                body: {
                    number: number.trim(),
                    documentDate,
                    amountRub: parsedAmount,
                },
            }).unwrap()
            onClose()
        } catch (e) {
            console.error(e)
        }
    }, [
        document,
        canSubmit,
        updateDocument,
        organizationId,
        number,
        documentDate,
        parsedAmount,
        onClose,
    ])

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <VStack gap="16" max>
                <Text title={t('documents.edit.title')} />
                <Input
                    label={t('documents.table.number')}
                    value={number}
                    onChange={(e) => { setNumber(e.target.value) }}
                    required
                    disabled={isLoading}
                />
                <Input
                    label={t('documents.table.date')}
                    type="date"
                    value={documentDate}
                    onChange={(e) => { setDocumentDate(e.target.value) }}
                    required
                    disabled={isLoading}
                    InputLabelProps={{ shrink: true }}
                />
                <Input
                    label={t('documents.table.amountRub')}
                    value={amountRub}
                    onChange={(e) => { setAmountRub(e.target.value) }}
                    required
                    disabled={isLoading}
                />
                <HStack gap="8" max justify="end">
                    <Button variant="clear" onClick={handleClose} disabled={isLoading}>
                        {t('documents.edit.cancel')}
                    </Button>
                    <Button
                        variant="glass-action"
                        onClick={() => { void handleSubmit() }}
                        disabled={isLoading || !canSubmit}
                    >
                        {isLoading ? t('documents.edit.saving') : t('documents.edit.save')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
