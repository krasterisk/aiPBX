import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import {
    useAiModels,
    useCreateAiModel,
    useUpdateAiModel,
    useDeleteAiModels,
    CreateAiModelDto,
    AiModel,
    AiModelsList,
    AiModelsListHeader,
    AiModelFormFields,
    EMPTY_AI_MODEL_FORM,
    toAiModelForm,
} from '@/entities/AiModel'
import cls from './ModelsPage.module.scss'

export const ModelsPage = memo(() => {
    const { t } = useTranslation('admin')

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedModel, setSelectedModel] = useState<AiModel | null>(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [modelToDeleteId, setModelToDeleteId] = useState<number | null>(null)

    const [formData, setFormData] = useState<CreateAiModelDto>({ ...EMPTY_AI_MODEL_FORM })

    const { data: models, isLoading, isError } = useAiModels()
    const [createAiModel, { isLoading: isCreating }] = useCreateAiModel()
    const [updateAiModel, { isLoading: isUpdating }] = useUpdateAiModel()
    const [deleteAiModels, { isLoading: isDeleting }] = useDeleteAiModels()

    const handleCreate = async () => {
        if (!formData.name.trim()) return
        try {
            await createAiModel({
                ...formData,
                name: formData.name.trim(),
                wireModelId: formData.wireModelId?.trim() || undefined,
            }).unwrap()
            setIsCreateModalOpen(false)
            setFormData({ ...EMPTY_AI_MODEL_FORM })
        } catch (e) {
            console.error('Failed to create model', e)
        }
    }

    const handleUpdate = async () => {
        if (!selectedModel) return
        if (!formData.name.trim()) return
        try {
            await updateAiModel({
                ...selectedModel,
                ...formData,
                name: formData.name.trim(),
                wireModelId: formData.wireModelId?.trim() || null,
            }).unwrap()
            setIsEditModalOpen(false)
            setSelectedModel(null)
        } catch (e) {
            console.error('Failed to update model', e)
        }
    }

    const confirmDelete = (id: number) => {
        setModelToDeleteId(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (modelToDeleteId === null) return
        try {
            await deleteAiModels({ ids: [modelToDeleteId] }).unwrap()
            setIsDeleteModalOpen(false)
            setModelToDeleteId(null)
        } catch (e) {
            console.error('Failed to delete model', e)
        }
    }

    const openCreateModal = () => {
        setFormData({ ...EMPTY_AI_MODEL_FORM })
        setIsCreateModalOpen(true)
    }

    const openEditModal = (model: AiModel) => {
        setSelectedModel(model)
        setFormData(toAiModelForm(model))
        setIsEditModalOpen(true)
    }

    return (
        <Page data-testid="ModelsPage" className={cls.ModelsPage}>
            <VStack gap="32" max>
                <AiModelsListHeader onCreate={openCreateModal} />

                {isError && <Text text={t('Error loading models')} variant="error" />}

                <AiModelsList
                    models={models}
                    isLoading={isLoading}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                />

                <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false) }}>
                    <VStack gap="16" max>
                        <Text title={t('Create AI Model')} />
                        <AiModelFormFields formData={formData} onChange={setFormData} />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => { setIsCreateModalOpen(false) }} variant="clear">{t('Cancel')}</Button>
                            <Button
                                onClick={handleCreate}
                                variant="outline"
                                disabled={isCreating || !formData.name.trim()}
                            >
                                {t('Create')}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false) }}>
                    <VStack gap="16" max>
                        <Text title={t('Edit AI Model')} />
                        <AiModelFormFields formData={formData} onChange={setFormData} />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => { setIsEditModalOpen(false) }} variant="clear">{t('Cancel')}</Button>
                            <Button
                                onClick={handleUpdate}
                                variant="outline"
                                disabled={isUpdating || !formData.name.trim()}
                            >
                                {t('Save')}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal>

                <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false) }}>
                    <VStack gap="16" max>
                        <Text title={t('Delete AI Model')} />
                        <Text text={t('Are you sure you want to delete this model?')} />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => { setIsDeleteModalOpen(false) }} variant="clear">{t('Cancel')}</Button>
                            <Button
                                onClick={handleDelete}
                                variant="outline"
                                color="error"
                                disabled={isDeleting}
                            >
                                {t('Delete')}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal>
            </VStack>
        </Page>
    )
})
