import { memo } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { OperatorUploadForm } from '@/features/OperatorAnalytics'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onBatchStarted?: (batchId: string) => void
}

export const UploadModal = memo(({ isOpen, onClose, onBatchStarted }: UploadModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} lazy size="wide" showClose>
        <OperatorUploadForm isOpen={isOpen} onClose={onClose} onBatchStarted={onBatchStarted} />
    </Modal>
))
