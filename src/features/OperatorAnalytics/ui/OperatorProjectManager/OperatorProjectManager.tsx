import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { SearchInput } from '@/shared/ui/mui/SearchInput/SearchInput'
import { useGetOperatorProjects, useCreateOperatorProject, useDeleteOperatorProject, useUpdateOperatorProject, OperatorProject } from '@/entities/Report'
import { toast } from 'react-toastify'
import { ProjectWizard } from '../ProjectWizard/ProjectWizard'
import cls from './OperatorProjectManager.module.scss'

// ─── ProjectItem ──────────────────────────────────────────────────────────────

interface ProjectItemProps {
    project: OperatorProject
    onEdit: (p: OperatorProject) => void
    onDelete: (id: string) => void
    onConfigure: (p: OperatorProject) => void
}

const ProjectItem = memo(({ project, onEdit, onDelete, onConfigure }: ProjectItemProps) => {
    const { t } = useTranslation('reports')
    const [confirm, setConfirm] = useState(false)

    return (
        <Card variant={'glass'} border={'partial'} padding={'16'} max className={cls.projectItem}>
            <HStack max justify={'between'} align={'center'} gap={'12'}>
                <HStack gap={'12'} align={'center'}>
                    <FolderOpenIcon sx={{ color: 'var(--accent-redesigned)', fontSize: 22 }} />
                    <VStack gap={'4'}>
                        <Text text={project.name} bold />
                        {project.description && <Text text={project.description} />}
                        <Text text={`${String(t('Звонков'))}: ${project.recordCount ?? 0}`} size={'s'} />
                    </VStack>
                </HStack>

                <HStack gap={'8'} align={'center'}>
                    {confirm ? (
                        <HStack gap={'8'} align={'center'}>
                            <Text text={String(t('Удалить?'))} />
                            <Button variant={'glass-action'} color={'error'} size={'s'}
                                onClick={() => { onDelete(project.id); setConfirm(false) }}
                            >
                                {String(t('Удалить'))}
                            </Button>
                            <IconButton size={'small'} onClick={() => setConfirm(false)} className={cls.iconBtn}>
                                <span style={{ fontSize: 13 }}>✕</span>
                            </IconButton>
                        </HStack>
                    ) : (
                        <>
                            <IconButton size={'small'} onClick={() => onConfigure(project)} className={cls.iconBtn} title={String(t('Настроить'))}>
                                <SettingsIcon fontSize={'small'} />
                            </IconButton>
                            <IconButton size={'small'} onClick={() => onEdit(project)} className={cls.iconBtn}>
                                <EditIcon fontSize={'small'} />
                            </IconButton>
                            <IconButton size={'small'} onClick={() => setConfirm(true)} className={cls.iconBtnDanger}>
                                <DeleteOutlineIcon fontSize={'small'} />
                            </IconButton>
                        </>
                    )}
                </HStack>
            </HStack>
        </Card>
    )
})

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

interface ProjectModalProps {
    open: boolean
    onClose: () => void
    initial?: OperatorProject | null
}

const ProjectModal = memo(({ open, onClose, initial }: ProjectModalProps) => {
    const { t } = useTranslation('reports')
    const [createProject, { isLoading: isCreating }] = useCreateOperatorProject()
    const [updateProject, { isLoading: isUpdating }] = useUpdateOperatorProject()

    const [name, setName] = useState(initial?.name ?? '')
    const [description, setDescription] = useState(initial?.description ?? '')

    const isEdit = Boolean(initial)
    const isSaving = isCreating || isUpdating

    // Sync when editing different project
    useEffect(() => {
        setName(initial?.name ?? '')
        setDescription(initial?.description ?? '')
    }, [initial])

    const handleSave = useCallback(async () => {
        if (!name.trim()) return
        try {
            if (isEdit && initial) {
                await updateProject({ id: initial.id, name: name.trim(), description: description.trim() }).unwrap()
            } else {
                await createProject({ name: name.trim(), description: description.trim() }).unwrap()
            }
            toast.success(isEdit ? String(t('Изменено')) : String(t('Создан проект')))
            onClose()
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [name, description, isEdit, initial, createProject, updateProject, onClose, t])

    return (
        <Modal isOpen={open} onClose={onClose} lazy>
            <div className={cls.modal}>
                <button type={'button'} className={cls.modalClose} onClick={onClose} aria-label={'Close'}>{'✕'}</button>
                <VStack gap={'16'}>
                    <Text title={isEdit ? String(t('Редактировать проект')) : String(t('Создать проект'))} bold />
                    <Textarea
                        label={String(t('Название проекта'))}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        size={'small'}
                        fullWidth
                        multiline={false}
                        required
                    />
                    <Textarea
                        label={String(t('Описание'))}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        size={'small'}
                        fullWidth
                        multiline
                        rows={3}
                    />
                    <Button
                        variant={'glass-action'}
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                    >
                        {isSaving ? String(t('Сохранение...')) : String(t('Сохранить'))}
                    </Button>
                </VStack>
            </div>
        </Modal>
    )
})

// ─── Main ─────────────────────────────────────────────────────────────────────

export const OperatorProjectManager = memo(() => {
    const { t } = useTranslation('reports')
    const { data: projects, isLoading } = useGetOperatorProjects()
    const [deleteProject] = useDeleteOperatorProject()

    const [search, setSearch] = useState('')
    const [showWizard, setShowWizard] = useState(false)
    const [wizardTarget, setWizardTarget] = useState<OperatorProject | undefined>(undefined)
    const [showCreate, setShowCreate] = useState(false)
    const [editTarget, setEditTarget] = useState<OperatorProject | null>(null)

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteProject(id).unwrap()
            toast.success(String(t('Проект удалён')))
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [deleteProject, t])

    const filtered = useMemo(() => {
        if (!projects) return []
        if (!search.trim()) return projects
        const q = search.toLowerCase()
        return projects.filter((p: OperatorProject) =>
            p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        )
    }, [projects, search])

    return (
        <VStack gap={'16'} max className={cls.OperatorProjectManager}>
            {/* Header */}
            <HStack max justify={'between'} align={'center'} gap={'16'} wrap={'wrap'} className={cls.header}>
                <Text title={String(t('Проекты'))} size={'l'} bold />
                <HStack gap={'12'} align={'center'} wrap={'wrap'}>
                    <SearchInput
                        className={cls.searchInput}
                        placeholder={String(t('Поиск...')) ?? ''}
                        value={search}
                        onChange={setSearch}
                    />
                    <Button
                        variant={'glass-action'}
                        addonLeft={<AddIcon fontSize={'small'} />}
                        onClick={() => { setWizardTarget(undefined); setShowWizard(true) }}
                    >
                        {String(t('Создать проект'))}
                    </Button>
                </HStack>
            </HStack>

            {/* List */}
            {isLoading
                ? [1, 2, 3].map(i => <Skeleton key={i} variant={'rounded'} height={72} className={cls.skeleton} />)
                : filtered.length > 0
                    ? (
                        <VStack gap={'8'} max>
                            {filtered.map((p: OperatorProject) => (
                                <ProjectItem
                                    key={p.id}
                                    project={p}
                                    onEdit={setEditTarget}
                                    onDelete={handleDelete}
                                    onConfigure={(p) => { setWizardTarget(p); setShowWizard(true) }}
                                />
                            ))}
                        </VStack>
                    )
                    : (
                        <Card padding={'48'} max border={'partial'} variant={'glass'}>
                            <VStack max align={'center'} justify={'center'} gap={'16'}>
                                <FolderOpenIcon sx={{ fontSize: 56, color: 'var(--icon-redesigned)', opacity: 0.4 }} />
                                <Text align={'center'} title={String(t('Проекты не найдены'))} />
                                <Text align={'center'} text={String(t('Создайте первый проект для группировки звонков'))} />
                                <Button
                                    variant={'glass-action'}
                                    addonLeft={<AddIcon fontSize={'small'} />}
                                    onClick={() => { setWizardTarget(undefined); setShowWizard(true) }}
                                >
                                    {String(t('Создать проект'))}
                                </Button>
                            </VStack>
                        </Card>
                    )
            }

            {/* Quick edit modal (name/description only) */}
            <ProjectModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
            />
            <ProjectModal
                open={Boolean(editTarget)}
                onClose={() => setEditTarget(null)}
                initial={editTarget}
            />

            {/* Full Wizard modal */}
            <Modal isOpen={showWizard} onClose={() => setShowWizard(false)} lazy>
                <div className={cls.modal} style={{ maxWidth: 760 }}>
                    <button
                        type={'button'}
                        className={cls.modalClose}
                        onClick={() => setShowWizard(false)}
                        aria-label={'Close'}
                    >
                        {'✕'}
                    </button>
                    <ProjectWizard
                        editProject={wizardTarget}
                        onClose={() => setShowWizard(false)}
                    />
                </div>
            </Modal>
        </VStack>
    )
})
