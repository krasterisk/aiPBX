import { memo } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { OperatorUploadForm } from '@/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
}

export const UploadModal = memo(({ isOpen, onClose }: UploadModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} lazy size="wide" showClose>
        <OperatorUploadForm isOpen={isOpen} onClose={onClose} />
    </Modal>
))
