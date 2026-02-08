import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Button } from '@/shared/ui/redesigned/Button';
import { Textarea } from '@/shared/ui/mui/Textarea';
import { Modal } from '@/shared/ui/redesigned/Modal';
import {
    usePrices,
    useCreatePrice,
    useUpdatePrice,
    useDeletePrice,
    CreatePriceDto,
    Price,
    PricesList,
    PricesListHeader
} from '@/entities/Price';
import { ClientSelect } from '@/entities/User';
import cls from './PricesPage.module.scss';

export const PricesPage = memo(() => {
    const { t } = useTranslation('admin');

    // State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [priceToDeleteId, setPriceToDeleteId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<CreatePriceDto>({ userId: 0, realtime: 0, analytic: 0 });

    // API
    const { data: prices, isLoading, isError } = usePrices();
    const [createPrice] = useCreatePrice();
    const [updatePrice] = useUpdatePrice();
    const [deletePrice] = useDeletePrice();

    // Handlers
    const handleCreate = async () => {
        try {
            await createPrice(formData).unwrap();
            setIsCreateModalOpen(false);
            setFormData({ userId: 0, realtime: 0, analytic: 0 });
        } catch (e) {
            console.error('Failed to create price', e);
        }
    };

    const handleUpdate = async () => {
        if (!selectedPrice) return;
        try {
            await updatePrice({
                id: selectedPrice.id,
                dto: {
                    realtime: formData.realtime,
                    analytic: formData.analytic
                }
            }).unwrap();
            setIsEditModalOpen(false);
            setSelectedPrice(null);
        } catch (e) {
            console.error('Failed to update price', e);
        }
    };

    const confirmDelete = (id: number) => {
        setPriceToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (priceToDeleteId === null) return;
        try {
            await deletePrice(priceToDeleteId).unwrap();
            setIsDeleteModalOpen(false);
            setPriceToDeleteId(null);
        } catch (e) {
            console.error('Failed to delete price', e);
        }
    };

    const openCreateModal = () => {
        setFormData({ userId: 0, realtime: 0, analytic: 0 });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (price: Price) => {
        setSelectedPrice(price);
        setFormData({ userId: price.userId, realtime: price.realtime, analytic: price.analytic });
        setIsEditModalOpen(true);
    };

    return (
        <Page data-testid="PricesPage" className={cls.PricesPage}>
            <VStack gap="32" max>
                <PricesListHeader onCreate={openCreateModal} />

                {isError && <Text text={t('Error loading prices')} variant="error" />}

                <PricesList
                    prices={prices}
                    isLoading={isLoading}
                    onEdit={openEditModal}
                    onDelete={confirmDelete}
                />

                {/* Create Modal */}
                <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                    <VStack gap="16" max>
                        <Text title={t('Create Price')} />
                        <ClientSelect
                            label={t('User ID') ?? ''}
                            clientId={String(formData.userId || '')}
                            onChangeClient={(id: string) => setFormData(prev => ({ ...prev, userId: Number(id) }))}
                            fullWidth
                            size="medium"
                        />
                        <Textarea
                            label={t('Realtime')}
                            value={String(formData.realtime)}
                            onChange={(e) => setFormData(prev => ({ ...prev, realtime: Number(e.target.value) }))}
                            type="number"
                        />
                        <Textarea
                            label={t('Analytic')}
                            value={String(formData.analytic)}
                            onChange={(e) => setFormData(prev => ({ ...prev, analytic: Number(e.target.value) }))}
                            type="number"
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
                        <Text title={t('Edit Price')} />
                        <Text
                            text={selectedPrice?.user?.name || selectedPrice?.userName || String(selectedPrice?.userId)}
                            bold
                        />
                        <Textarea
                            label={t('Realtime')}
                            value={String(formData.realtime)}
                            onChange={(e) => setFormData(prev => ({ ...prev, realtime: Number(e.target.value) }))}
                            type="number"
                        />
                        <Textarea
                            label={t('Analytic')}
                            value={String(formData.analytic)}
                            onChange={(e) => setFormData(prev => ({ ...prev, analytic: Number(e.target.value) }))}
                            type="number"
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
                        <Text title={t('Delete Price')} />
                        <Text text={t('Are you sure you want to delete this price?')} />
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
