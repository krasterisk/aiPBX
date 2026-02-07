import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Button } from '@/shared/ui/redesigned/Button';
import { Textarea } from '@/shared/ui/mui/Textarea';
import { Modal } from '@/shared/ui/redesigned/Modal';
import {
    useAiModels,
    useCreateAiModel,
    useUpdateAiModel,
    useDeleteAiModels,
    CreateAiModelDto,
    AiModel,
    AiModelsList,
    AiModelsListHeader
} from '@/entities/AiModel';
import cls from './ModelsPage.module.scss';

export const ModelsPage = memo(() => {
    const { t } = useTranslation('admin');

    // State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<AiModel | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modelToDeleteId, setModelToDeleteId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<CreateAiModelDto>({ name: '', comment: '' });

    // API
    const { data: models, isLoading, isError } = useAiModels();
    const [createAiModel] = useCreateAiModel();
    const [updateAiModel] = useUpdateAiModel();
    const [deleteAiModels] = useDeleteAiModels();

    // Handlers
    const handleCreate = async () => {
        try {
            await createAiModel(formData).unwrap();
            setIsCreateModalOpen(false);
            setFormData({ name: '', comment: '' });
        } catch (e) {
            console.error('Failed to create model', e);
        }
    };

    const handleUpdate = async () => {
        if (!selectedModel) return;
        try {
            await updateAiModel({ ...selectedModel, ...formData }).unwrap();
            setIsEditModalOpen(false);
            setSelectedModel(null);
        } catch (e) {
            console.error('Failed to update model', e);
        }
    };

    const confirmDelete = (id: number) => {
        setModelToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (modelToDeleteId === null) return;
        try {
            await deleteAiModels({ ids: [modelToDeleteId] }).unwrap();
            setIsDeleteModalOpen(false);
            setModelToDeleteId(null);
        } catch (e) {
            console.error('Failed to delete model', e);
        }
    };

    const openCreateModal = () => {
        setFormData({ name: '', comment: '' });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (model: AiModel) => {
        setSelectedModel(model);
        setFormData({ name: model.name, comment: model.comment });
        setIsEditModalOpen(true);
    };

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

                {/* Create Modal */}
                <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                    <VStack gap="16" max>
                        <Text title={t('Create AI Model')} />
                        <Textarea
                            label={t('Name')}
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Textarea
                            label={t('Comment')}
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => setIsCreateModalOpen(false)} variant="clear">{t('Cancel')}</Button>
                            <Button onClick={handleCreate} variant="outline">{t('Create')}</Button>
                        </HStack>
                    </VStack>
                </Modal>

                {/* Edit Modal */}
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <VStack gap="16" max>
                        <Text title={t('Edit AI Model')} />
                        <Textarea
                            label={t('Name')}
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Textarea
                            label={t('Comment')}
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => setIsEditModalOpen(false)} variant="clear">{t('Cancel')}</Button>
                            <Button onClick={handleUpdate} variant="outline">{t('Save')}</Button>
                        </HStack>
                    </VStack>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <VStack gap="16" max>
                        <Text title={t('Delete AI Model')} />
                        <Text text={t('Are you sure you want to delete this model?')} />
                        <HStack justify="end" gap="16" max>
                            <Button onClick={() => setIsDeleteModalOpen(false)} variant="clear">{t('Cancel')}</Button>
                            <Button onClick={handleDelete} variant="outline" color="error">{t('Delete')}</Button>
                        </HStack>
                    </VStack>
                </Modal>
            </VStack>
        </Page>
    );
});
