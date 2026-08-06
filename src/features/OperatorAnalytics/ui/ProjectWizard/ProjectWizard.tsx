import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import {
    OperatorProject,
    ProjectTemplate,
    MetricDefinition,
    DefaultMetricKey,
    TagDefinition,
    useCreateOperatorProject,
    projectWizardActions,
    getWizardName,
    getWizardDescription,
    getWizardSystemPrompt,
    getWizardCustomMetrics,
    getWizardVisibleDefaultMetrics,
    getWizardCallTaxonomy,
    getWizardSelectedTemplateId,
} from '@/entities/Report'
import { WizardPhaseIndicator, CreateWizardStep } from './WizardPhaseIndicator'
import { WizardHeader } from './WizardHeader'
import { ProjectSettingsForm } from './ProjectSettingsForm'
import { WizardStep0_Templates } from './WizardStep0_Templates'
import { WizardStep2_MetricBuilder } from './WizardStep2_MetricBuilder'
import { WizardStep3_DefaultMetrics } from './WizardStep3_DefaultMetrics'
import { TaxonomyEditor } from './TaxonomyEditor'
import cls from './ProjectWizard.module.scss'

interface ProjectWizardProps {
    editProject?: OperatorProject
    onClose: () => void
    onSuccess?: () => void
}

export const ProjectWizard = memo(({ editProject, onClose, onSuccess }: ProjectWizardProps) => {
    const dispatch = useAppDispatch()
    const [createProject, { isLoading: isCreating }] = useCreateOperatorProject()

    const initializedRef = useRef(false)
    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true
        if (editProject) {
            dispatch(projectWizardActions.openEdit(editProject))
        } else {
            dispatch(projectWizardActions.openCreate())
        }
    }, [dispatch, editProject])

    if (editProject) {
        return (
            <ProjectSettingsForm
                editProject={editProject}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        )
    }

    return (
        <WizardCreateFlow
            onClose={onClose}
            onSuccess={onSuccess}
            isCreating={isCreating}
            createProject={createProject}
        />
    )
})

interface WizardCreateFlowProps {
    onClose: () => void
    onSuccess?: () => void
    isCreating: boolean
    createProject: ReturnType<typeof useCreateOperatorProject>[0]
}

const WizardCreateFlow = memo(({ onClose, onSuccess, isCreating, createProject }: WizardCreateFlowProps) => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [createStep, setCreateStep] = useState<CreateWizardStep>(1)
    const [showCustomMetrics, setShowCustomMetrics] = useState(false)

    const name = useSelector(getWizardName)
    const description = useSelector(getWizardDescription)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const callTaxonomy = useSelector(getWizardCallTaxonomy)
    const selectedTemplateId = useSelector(getWizardSelectedTemplateId)

    const handleCreate = useCallback(async () => {
        try {
            await createProject({
                name: name.trim() || String(t('Новый проект')),
                description: description.trim(),
                systemPrompt: systemPrompt.trim(),
                customMetricsSchema: customMetrics,
                visibleDefaultMetrics: visibleDefaults,
                callTaxonomy,
            }).unwrap()

            dispatch(projectWizardActions.close())
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Wizard create error:', err)
        }
    }, [
        name, description, systemPrompt, customMetrics, visibleDefaults, callTaxonomy,
        createProject, dispatch, onClose, onSuccess, t,
    ])

    const handleNext = useCallback(() => {
        if (createStep === 1) {
            if (!name.trim()) return
            setCreateStep(2)
            return
        }
        if (createStep === 2) {
            if (visibleDefaults.length === 0) return
            setCreateStep(3)
            return
        }
        void handleCreate()
    }, [createStep, name, visibleDefaults.length, handleCreate])

    const handleBack = useCallback(() => {
        if (createStep === 1) {
            onClose()
            return
        }
        setCreateStep((prev) => (prev === 3 ? 2 : 1))
    }, [createStep, onClose])

    const canProceed =
        createStep === 1 ? Boolean(name.trim())
            : createStep === 2 ? visibleDefaults.length > 0
                : true

    return (
        <VStack gap={'16'} max className={cls.ProjectWizard}>
            <WizardHeader
                title={name.trim() || String(t('Новый проект'))}
                onClose={onClose}
            />

            <WizardPhaseIndicator
                createStep={createStep}
                onGoToStep={setCreateStep}
            />

            <VStack max className={cls.wizardContent} gap={'16'}>
                {createStep === 1 && (
                    <VStack gap={'16'} max>
                        <Textarea
                            label={String(t('Название проекта'))}
                            value={name}
                            onChange={e => dispatch(projectWizardActions.setName(e.target.value))}
                            size={'small'}
                            fullWidth
                            multiline={false}
                        />
                        <Textarea
                            label={String(t('Описание проекта'))}
                            value={description}
                            onChange={e => dispatch(projectWizardActions.setDescription(e.target.value))}
                            size={'small'}
                            fullWidth
                            multiline={false}
                        />
                        <Text
                            text={String(t('CREATE_TEMPLATE_HINT'))}
                            size={'s'}
                        />
                        <WizardStep0_Templates
                            selectedTemplateId={selectedTemplateId}
                            onSelect={(tpl: ProjectTemplate) => dispatch(projectWizardActions.applyTemplate(tpl))}
                        />
                    </VStack>
                )}

                {createStep === 2 && (
                    <VStack gap={'16'} max>
                        <WizardStep3_DefaultMetrics
                            visibleMetrics={visibleDefaults}
                            onToggle={(key: DefaultMetricKey) => dispatch(projectWizardActions.toggleDefaultMetric(key))}
                        />
                        <Card variant={'glass'} border={'partial'} padding={'16'} max>
                            <VStack gap={'8'} max>
                                <HStack
                                    max
                                    justify={'between'}
                                    align={'center'}
                                    onClick={() => { setShowCustomMetrics(prev => !prev) }}
                                    className={cls.clickable}
                                >
                                    <Text text={String(t('Кастомные метрики'))} bold />
                                    <Text text={showCustomMetrics ? '▲' : '▼'} />
                                </HStack>
                                {showCustomMetrics && (
                                    <WizardStep2_MetricBuilder
                                        metrics={customMetrics}
                                        systemPrompt={systemPrompt}
                                        visibleDefaultMetrics={visibleDefaults}
                                        onChangeMetrics={(m: MetricDefinition[]) => dispatch(projectWizardActions.setCustomMetrics(m))}
                                    />
                                )}
                            </VStack>
                        </Card>
                    </VStack>
                )}

                {createStep === 3 && (
                    <Card variant={'glass'} border={'partial'} padding={'16'} max>
                        <VStack gap={'12'} max>
                            <Text text={String(t('Темы звонков'))} bold />
                            <TaxonomyEditor
                                taxonomy={callTaxonomy}
                                onChange={(taxonomy: TagDefinition[]) => {
                                    dispatch(projectWizardActions.setCallTaxonomy(taxonomy))
                                }}
                            />
                        </VStack>
                    </Card>
                )}
            </VStack>

            <HStack max justify={'end'} align={'center'} gap={'12'} wrap={'wrap'} className={cls.navSeparator}>
                <Button
                    variant={'glass-action'}
                    onClick={handleBack}
                    addonLeft={<ArrowBackIcon fontSize={'small'} />}
                >
                    {createStep === 1 ? String(t('Закрыть')) : String(t('Назад'))}
                </Button>
                <Button
                    variant={'glass-action'}
                    color={createStep === 3 ? 'success' : undefined}
                    onClick={handleNext}
                    addonRight={createStep === 3
                        ? <CheckIcon fontSize={'small'} />
                        : <ArrowForwardIcon fontSize={'small'} />}
                    disabled={isCreating || !canProceed}
                >
                    {createStep === 3
                        ? (isCreating ? String(t('Сохранение...')) : String(t('Создать')))
                        : String(t('Далее'))}
                </Button>
            </HStack>
        </VStack>
    )
})
