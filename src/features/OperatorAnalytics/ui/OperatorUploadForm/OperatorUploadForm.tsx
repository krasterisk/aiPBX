import { memo, useState, useCallback, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { ProjectSelect } from '../ProjectSelect/ProjectSelect'
import {
    useUploadOperatorFiles,
    BatchUploadResponse,
    OperatorAnalysisResult
} from '@/entities/Report'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import cls from './OperatorUploadForm.module.scss'

const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp4', 'audio/webm']
const MAX_SIZE_MB = 50
const LANGUAGE_OPTIONS = [
    { id: 'auto', name: 'Auto' },
    { id: 'ru', name: 'RU' },
    { id: 'en', name: 'EN' },
    { id: 'de', name: 'DE' },
    { id: 'zh', name: 'ZH' },
    { id: 'kz', name: 'KZ' },
    { id: 'uk', name: 'UK' }
]

interface OperatorUploadFormProps {
    isOpen?: boolean
    onClose?: () => void
}

export const OperatorUploadForm = memo(({ isOpen, onClose }: OperatorUploadFormProps) => {
    const { t } = useTranslation('reports')
    const [files, setFiles] = useState<{ file: File }[]>([])
    const [operatorName, setOperatorName] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [language, setLanguage] = useState<{ id: string; name: string } | null>(LANGUAGE_OPTIONS[0])
    const [projectId, setProjectId] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadFiles, { isLoading }] = useUploadOperatorFiles()

    useEffect(() => {
        if (isOpen) {
            setFiles([])
            setOperatorName('')
            setClientPhone('')
            setLanguage(LANGUAGE_OPTIONS[0])
            setProjectId('')
        }
    }, [isOpen])

    const validateFile = (file: File) => {
        if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            toast.error(`${file.name}: неверный формат`)
            return false
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`${file.name}: размер превышает ${MAX_SIZE_MB} МБ`)
            return false
        }
        return true
    }

    const addFiles = useCallback((newFiles: File[]) => {
        const valid = newFiles.filter(validateFile).map(f => ({ file: f }))
        setFiles(prev => [...prev, ...valid])
    }, [])

    const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        addFiles(Array.from(e.dataTransfer.files))
    }, [addFiles])

    const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true) }
    const onDragLeave = () => setIsDragging(false)

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files))
    }

    const handleSubmit = useCallback(async () => {
        if (!files.length) return
        const formData = new FormData()
        files.forEach(({ file }) => formData.append(files.length === 1 ? 'file' : 'files', file))
        if (operatorName) formData.append('operatorName', operatorName)
        if (clientPhone) formData.append('clientPhone', clientPhone)
        if (language && language.id !== 'auto') formData.append('language', language.id)
        if (projectId) formData.append('projectId', projectId)
        try {
            const result = await uploadFiles(formData).unwrap()

            if (result && 'items' in result) {
                toast.success(`${t('В работу ушло')}: ${(result as BatchUploadResponse).items.length} ${t('файлов')}`)
            } else if (result && 'filename' in result) {
                toast.success(`${(result as OperatorAnalysisResult).filename} — ${t('загружен и отправлен в работу')}`)
            } else {
                toast.success(t('Файлы успешно загружены'))
            }

            setFiles([])
            // Longer delay to ensure toast is visible and RTK Query invalidation starts before unmounting
            setTimeout(() => {
                onClose?.()
            }, 800)
        } catch (err: any) {
            console.error('Upload error:', err)
            const message = err?.data?.message || err?.message || t('Ошибка при загрузке')
            toast.error(String(message))
        }
    }, [files, operatorName, clientPhone, language, projectId, uploadFiles, t, onClose])

    return (
        <VStack gap="16" max>
            {/* Header */}
            <Text title={String(t('Загрузить звонок'))} bold size="l" />

            {/* Drop zone */}
            <div
                className={`${cls.dropZone} ${isDragging ? cls.dragging : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".mp3,.wav,.ogg,.m4a"
                    className={cls.hiddenInput}
                    onChange={onFileInputChange}
                />
                <VStack gap="8" align="center">
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    <Text text="🎵" />
                    <Text text={String(t('Перетащите файлы сюда'))} bold />
                    <Text text={String(t('или выберите файлы'))} />
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    <Text text="mp3, wav, ogg, m4a • max 50 МБ" size="s" />
                </VStack>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <VStack gap="8" max>
                    {files.map((item, i) => (
                        <HStack key={i} max justify="between" align="center" className={cls.fileItem}>
                            <Text text={item.file.name} />
                            <Button
                                variant="clear"
                                color="error"
                                onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}
                            >
                                <CloseIcon fontSize="small" />
                            </Button>
                        </HStack>
                    ))}
                </VStack>
            )}

            {/* Fields */}
            <div className={cls.fieldsGrid}>
                <Textarea
                    label={String(t('Оператор'))}
                    value={operatorName}
                    onChange={e => setOperatorName(e.target.value)}
                    size="small"
                />
                <Textarea
                    label={String(t('Телефон клиента'))}
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    size="small"
                />
                <Combobox
                    label={String(t('Язык записи'))}
                    options={LANGUAGE_OPTIONS}
                    value={language}
                    onChange={(_, v) => setLanguage(v)}
                    getOptionLabel={(o: { name: string }) => o.name}
                    isOptionEqualToValue={(o: { id: string }, v: { id: string }) => o.id === v.id}
                    disableClearable
                />
                <ProjectSelect value={projectId} onChange={setProjectId} />
            </div>

            {/* Submit */}
            <Button
                variant="glass-action"
                onClick={handleSubmit}
                disabled={!files.length || isLoading}
            >
                {isLoading ? `${String(t('Обработка'))}...` : String(t('Загрузить звонок'))}
            </Button>
        </VStack>
    )
})
