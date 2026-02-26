import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Skeleton, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { SearchInput } from '@/shared/ui/mui/SearchInput/SearchInput'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    useGetOperatorProjects,
    useDeleteOperatorProject,
    OperatorProject,
    projectWizardActions,
    projectWizardReducer,
    getWizardIsOpen,
} from '@/entities/Report'
import { toast } from 'react-toastify'
import { ProjectWizard } from '../ProjectWizard/ProjectWizard'
import cls from './OperatorProjectManager.module.scss'

const reducers: ReducersList = {
    projectWizard: projectWizardReducer
}

// ─── ProjectItem ──────────────────────────────────────────────────────────────

interface ProjectItemProps {
    project: OperatorProject
    onEdit: (p: OperatorProject) => void
    onDelete: (id: string) => void
}

const ProjectItem = memo(({ project, onEdit, onDelete }: ProjectItemProps) => {
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
                    </VStack>
                </HStack>

                <HStack gap={'8'} align={'center'}>
                    {confirm ? (
                        <HStack gap={'8'} align={'center'}>
                            <Text text={String(t('Удалить?'))} />
                            <Button variant={'glass-action'} color={'error'} size={'s'}
                                onClick={() => { onDelete(project.id); setConfirm(false) }}>
                                {String(t('Удалить'))}
                            </Button>
                            <IconButton size={'small'} onClick={() => setConfirm(false)} className={cls.iconBtn}>
                                <span style={{ fontSize: 13 }}>✕</span>
                            </IconButton>
                        </HStack>
                    ) : (
                        <>
                            <IconButton size={'small'} onClick={() => onEdit(project)} className={cls.iconBtn} title={String(t('Настроить'))}>
                                <SettingsIcon fontSize={'small'} />
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export const OperatorProjectManager = memo(() => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const { data: projects, isLoading } = useGetOperatorProjects()
    const [deleteProject] = useDeleteOperatorProject()

    const [search, setSearch] = useState('')
    const [wizardTarget, setWizardTarget] = useState<OperatorProject | undefined>(undefined)

    const wizardIsOpen = useSelector(getWizardIsOpen)

    const handleOpenWizardCreate = useCallback(() => {
        setWizardTarget(undefined)
        dispatch(projectWizardActions.openCreate())
    }, [dispatch])

    const handleOpenWizardEdit = useCallback((project: OperatorProject) => {
        setWizardTarget(project)
        dispatch(projectWizardActions.openEdit(project))
    }, [dispatch])

    const handleCloseWizard = useCallback(() => {
        dispatch(projectWizardActions.close())
    }, [dispatch])

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
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
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
                        <Button variant={'glass-action'}
                            addonLeft={<AddIcon fontSize={'small'} />}
                            onClick={handleOpenWizardCreate}>
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
                                        onEdit={handleOpenWizardEdit}
                                        onDelete={handleDelete}
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
                                    <Button variant={'glass-action'}
                                        addonLeft={<AddIcon fontSize={'small'} />}
                                        onClick={handleOpenWizardCreate}>
                                        {String(t('Создать проект'))}
                                    </Button>
                                </VStack>
                            </Card>
                        )
                }

                {/* Wizard modal (create + edit) */}
                <Modal isOpen={wizardIsOpen} onClose={handleCloseWizard} lazy size={'wide'}>
                    <ProjectWizard
                        editProject={wizardTarget}
                        onClose={handleCloseWizard}
                    />
                </Modal>
            </VStack>
        </DynamicModuleLoader>
    )
})
