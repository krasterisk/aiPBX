import { memo } from 'react'
import { ReportList } from '@/entities/Report'
import { VStack } from '@/shared/ui/redesigned/Stack'

const DashboardCallRecordsPage = memo(() => {
    return (
        <VStack max gap={'16'}>
            <ReportList />
        </VStack>
    )
})

export default DashboardCallRecordsPage
