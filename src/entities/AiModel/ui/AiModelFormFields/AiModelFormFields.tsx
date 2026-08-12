import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import {
    CreateAiModelDto,
    REALTIME_VENDORS,
    RealtimeVendor,
    inferRealtimeVendorFromName,
} from '../../model/types/aiModel'

interface AiModelFormFieldsProps {
    formData: CreateAiModelDto
    onChange: (next: CreateAiModelDto) => void
}

interface VendorOption {
    value: RealtimeVendor
    label: string
}

export const AiModelFormFields = memo((props: AiModelFormFieldsProps) => {
    const { formData, onChange } = props
    const { t } = useTranslation('admin')

    const vendorOptions = useMemo<VendorOption[]>(() => REALTIME_VENDORS.map((value) => ({
        value,
        label: String(t(`realtimeVendor.${value}`)),
    })), [t])

    const vendor = formData.realtimeVendor || 'openai'
    const selectedVendor = vendorOptions.find((o) => o.value === vendor) || vendorOptions[0]

    const patch = (partial: Partial<CreateAiModelDto>) => {
        onChange({ ...formData, ...partial })
    }

    const onNameChange = (name: string) => {
        const prevInferred = inferRealtimeVendorFromName(formData.name)
        const nextInferred = inferRealtimeVendorFromName(name)
        const shouldRetargetVendor = !formData.realtimeVendor ||
            formData.realtimeVendor === prevInferred
        patch({
            name,
            ...(shouldRetargetVendor ? { realtimeVendor: nextInferred } : {}),
        })
    }

    return (
        <VStack gap="16" max>
            <Textarea
                label={t('Name')}
                value={formData.name}
                onChange={(e) => { onNameChange(e.target.value) }}
            />
            <Combobox
                label={String(t('Realtime provider'))}
                options={vendorOptions}
                getOptionLabel={(o: VendorOption) => o.label}
                isOptionEqualToValue={(a: VendorOption, b: VendorOption) => a.value === b.value}
                value={selectedVendor}
                disableClearable
                onChange={(_, v) => {
                    const next = Array.isArray(v) ? v[0] : v
                    if (next?.value) {
                        patch({ realtimeVendor: next.value })
                    }
                }}
            />
            <Textarea
                label={t('Wire model ID')}
                value={formData.wireModelId || ''}
                onChange={(e) => { patch({ wireModelId: e.target.value }) }}
            />
            <Text
                size="s"
                variant="accent"
                text={vendor === 'yandex'
                    ? (t('Wire model ID hint yandex') ?? '')
                    : (t('Wire model ID hint') ?? '')}
            />
            <Textarea
                label={t('Publish Name')}
                value={formData.publishName}
                onChange={(e) => { patch({ publishName: e.target.value }) }}
            />
            <Textarea
                label={t('Comment')}
                value={formData.comment}
                onChange={(e) => { patch({ comment: e.target.value }) }}
            />
            <Check
                checked={formData.publish}
                onChange={(e) => { patch({ publish: e.target.checked }) }}
                label={t('Publish') ?? ''}
            />
        </VStack>
    )
})
