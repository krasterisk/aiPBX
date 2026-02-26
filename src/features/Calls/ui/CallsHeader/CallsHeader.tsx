import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { SearchInput } from '@/shared/ui/mui/SearchInput/SearchInput'
import { PeriodPicker } from '@/entities/PeriodPicker'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { PeriodExtendedFilters } from '@/features/PeriodExtendedFilter'
import { CdrSource } from '@/entities/Report'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FilterListIcon from '@mui/icons-material/FilterList'

interface CallsHeaderProps {
    tab?: string
    startDate?: string | null
    endDate?: string | null
    isInited?: boolean
    search?: string
    source?: CdrSource
    onChangeTab: (v: string) => void
    onChangeStartDate: (v: string) => void
    onChangeEndDate: (v: string) => void
    onChangeSearch: (v: string) => void
    onUpload: () => void
    onExport: () => void
    onChangeSource?: (v: CdrSource | undefined) => void
}

export const CallsHeader = memo((props: CallsHeaderProps) => {
    const {
        tab, startDate, endDate, isInited, search, source,
        onChangeTab, onChangeStartDate, onChangeEndDate,
        onChangeSearch, onUpload, onExport, onChangeSource
    } = props

    const { t } = useTranslation('reports')
    const [filterShow, setFilterShow] = useState(false)

    return (
        <VStack gap="16" max>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <Text title={String(t('Журнал звонков'))} size="l" bold />

                <HStack gap="8" wrap="wrap" align="center">
                    <PeriodPicker
                        tab={tab}
                        isInited={isInited}
                        startDate={startDate ?? undefined}
                        endDate={endDate ?? undefined}
                        onChangeTab={onChangeTab}
                        onChangeStartDate={onChangeStartDate}
                        onChangeEndDate={onChangeEndDate}
                        onOpenFilters={() => setFilterShow(true)}
                    />
                    <SearchInput
                        placeholder={String(t('Поиск...'))}
                        onChange={onChangeSearch}
                        value={search}
                    />
                </HStack>
            </HStack>

            <HStack max justify="between" align="center" gap="12" wrap="wrap">
                <Button
                    variant="clear"
                    addonLeft={<FilterListIcon fontSize="small" />}
                    onClick={() => setFilterShow(v => !v)}
                >
                    {String(t('Фильтры'))}
                </Button>
                <HStack gap="8" wrap="wrap">
                    <Button
                        variant="clear"
                        color="success"
                        addonLeft={<FileDownloadIcon fontSize="small" />}
                        onClick={onExport}
                    >
                        {String(t('Выгрузить'))}
                    </Button>
                    <Button
                        variant="glass-action"
                        addonLeft={<UploadFileIcon fontSize="small" />}
                        onClick={onUpload}
                    >
                        {String(t('Загрузить аудио'))}
                    </Button>
                </HStack>
            </HStack>

            <PeriodExtendedFilters
                source={source}
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                onChangeAssistant={() => { }}
                onChangeUserId={() => { }}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
                onChangeSource={onChangeSource}
                show={filterShow}
                onClose={() => setFilterShow(false)}
            />
        </VStack>
    )
})
