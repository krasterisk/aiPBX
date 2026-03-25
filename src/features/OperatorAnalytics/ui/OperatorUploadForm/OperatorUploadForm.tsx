import { memo, useState, useCallback, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { ProjectSelect } from '../ProjectSelect/ProjectSelect'
import {
    useUploadOperatorFiles
} from '@/entities/Report'
import { toast } from 'react-toastify'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AudioFileIcon from '@mui/icons-material/AudioFile'
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

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface OperatorUploadFormProps {
    isOpen?: boolean
    onClose?: () => void
    onBatchStarted?: (batchId: string) => void
}

export const OperatorUploadForm = memo(({ isOpen, onClose, onBatchStarted }: OperatorUploadFormProps) => {
    const { t } = useTranslation('reports')
    const [files, setFiles] = useState<Array<{ file: File }>>([])
    const [operatorName, setOperatorName] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [language, setLanguage] = useState<{ id: string, name: string } | null>(LANGUAGE_OPTIONS[0])
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
    const onDragLeave = () => { setIsDragging(false) }

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files))
    }

    const handleSubmit = useCallback(async () => {
        if (!files.length) return
        const formData = new FormData()
        files.forEach(({ file }) => { formData.append(files.length === 1 ? 'file' : 'files', file) })
        if (operatorName) formData.append('operatorName', operatorName)
        if (clientPhone) formData.append('clientPhone', clientPhone)
        if (language && language.id !== 'auto') formData.append('language', language.id)
        if (projectId) formData.append('projectId', projectId)
        try {
            const result = await uploadFiles(formData).unwrap()

            if (result && 'batchId' in result && result.batchId) {
                toast.success(`${t('В работу ушло')}: ${(result).items.length} ${t('файлов')}`)
                setFiles([])
                onBatchStarted?.(result.batchId)
                onClose?.()
            } else if (result && 'items' in result) {
                toast.success(`${t('В работу ушло')}: ${(result).items.length} ${t('файлов')}`)
                setFiles([])
                setTimeout(() => { onClose?.() }, 800)
            } else if (result && 'filename' in result) {
                toast.success(`${(result).filename} — ${t('загружен и отправлен в работу')}`)
                setFiles([])
                setTimeout(() => { onClose?.() }, 800)
            } else {
                toast.success(t('Файлы успешно загружены'))
                setFiles([])
                setTimeout(() => { onClose?.() }, 800)
            }
        } catch (err: any) {
            console.error('Upload error:', err)
            const message = err?.data?.message || err?.message || t('Ошибка при загрузке')
            toast.error(String(message))
        }
    }, [files, operatorName, clientPhone, language, projectId, uploadFiles, t, onClose, onBatchStarted])

    const dropZoneClasses = [
        cls.dropZone,
        isDragging ? cls.dragging : '',
        files.length > 0 ? cls.hasFiles : ''
    ].filter(Boolean).join(' ')

    return (
        <VStack gap="16" max>
            {/* Header */}
            <Text title={String(t('Загрузить звонок'))} bold size="l" />

            {/* Drop zone */}
            <div
                className={dropZoneClasses}
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
                <div className={cls.iconContainer}>
                    <CloudUploadIcon className={cls.uploadIcon} />
                </div>
                <Text text={String(t('Перетащите файлы сюда'))} bold />
                <Text text={String(t('или выберите файлы'))} />
                {/* eslint-disable-next-line i18next/no-literal-string */}
                <Text text="mp3, wav, ogg, m4a • max 50 MB" size="s" />
            </div>

            {/* File list */}
            {files.length > 0 && (
                <VStack gap="8" max>
                    <div className={cls.fileListHeader}>
                        <Text text={String(t('Файлы'))} bold size="s" />
                        {/* eslint-disable-next-line i18next/no-literal-string */}
                        <span className={cls.fileCount}>{files.length}</span>
                    </div>
                    <div className={cls.fileList}>
                        {files.map((item, i) => (
                            <div key={i} className={cls.fileItem}>
                                <div className={cls.fileIconWrap}>
                                    <AudioFileIcon className={cls.uploadIcon} />
                                </div>
                                <div className={cls.fileInfo}>
                                    <span className={cls.fileName}>{item.file.name}</span>
                                    <span className={cls.fileSize}>{formatFileSize(item.file.size)}</span>
                                </div>
                                <button
                                    type="button"
                                    className={cls.removeBtn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setFiles(p => p.filter((_, idx) => idx !== i))
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </div>
                </VStack>
            )}

            {/* Progress bar during upload */}
            {isLoading && (
                <div className={cls.progressWrapper}>
                    <div className={cls.progressBar} />
                    <span className={cls.progressText}>
                        {String(t('Загрузка...'))}
                    </span>
                </div>
            )}

            {/* Fields */}
            <div className={isLoading ? `${cls.fieldsGrid} ${cls.formDisabled}` : cls.fieldsGrid}>
                <Textarea
                    label={String(t('Оператор'))}
                    value={operatorName}
                    onChange={e => { setOperatorName(e.target.value) }}
                    size="small"
                />
                <Textarea
                    label={String(t('Телефон клиента'))}
                    value={clientPhone}
                    onChange={e => { setClientPhone(e.target.value) }}
                    size="small"
                />
                <Combobox
                    label={String(t('Язык записи'))}
                    options={LANGUAGE_OPTIONS}
                    value={language}
                    onChange={(_, v) => { setLanguage(v) }}
                    getOptionLabel={(o: { name: string }) => o.name}
                    isOptionEqualToValue={(o: { id: string }, v: { id: string }) => o.id === v.id}
                    disableClearable
                />
                <ProjectSelect value={projectId} onChange={setProjectId} />
            </div>

            {/* Submit */}
            <div className={cls.submitArea}>
                <Button
                    variant="glass-action"
                    onClick={handleSubmit}
                    disabled={!files.length || isLoading}
                    fullWidth
                >
                    {isLoading ? String(t('Загрузка...')) : String(t('Загрузить звонок'))}
                </Button>
            </div>
        </VStack>
    )
})
