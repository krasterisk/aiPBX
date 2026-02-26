import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useGenerateMetricsFromPrompt, MetricDefinition } from '@/entities/Report'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import cls from './ProjectWizard.module.scss'

interface ChatMessage {
    role: 'ai' | 'user'
    text: string
    time: string
    isTyping?: boolean
}

const AI_QUESTIONS = [
    'Расскажите о своём бизнесе. Чем занимается ваша компания?',
    'Какие основные задачи решают ваши операторы по телефону?',
    'Что для вас самое важное в качестве обслуживания?',
    'Нужно ли проверять допродажи или кросс-продажи?',
]

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const TYPING_DELAY_MS = 1500 + Math.random() * 1500 // 1.5–3s

interface WizardStep1Props {
    systemPrompt: string
    onChangeSystemPrompt: (value: string) => void
    onMetricsGenerated: (metrics: MetricDefinition[], prompt: string) => void
}

export const WizardStep1_Chat = memo(({ systemPrompt, onChangeSystemPrompt, onMetricsGenerated }: WizardStep1Props) => {
    const { t } = useTranslation('reports')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [questionIndex, setQuestionIndex] = useState(0)
    const [isAiTyping, setIsAiTyping] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [generateMetrics] = useGenerateMetricsFromPrompt()

    // Show first AI message with typing indicator on mount
    useEffect(() => {
        setIsAiTyping(true)
        const timer = setTimeout(() => {
            setMessages([{ role: 'ai', text: AI_QUESTIONS[0], time: getTime() }])
            setIsAiTyping(false)
        }, TYPING_DELAY_MS)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        if (!isAiTyping) {
            inputRef.current?.focus()
        }
    }, [messages, isAiTyping])

    const addAiMessageWithDelay = useCallback((text: string, afterFn?: () => void) => {
        setIsAiTyping(true)
        const delay = 1500 + Math.random() * 1500
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text, time: getTime() }])
            setIsAiTyping(false)
            afterFn?.()
        }, delay)
    }, [])

    const startGeneration = useCallback(async (currentMessages: ChatMessage[]) => {
        setIsGenerating(true)
        setIsAiTyping(true)

        // Build payload matching GenerateSchemaDto
        const payload = {
            messages: currentMessages.map(m => ({ role: m.role, text: m.text })),
            systemPrompt: systemPrompt || undefined,
        }

        try {
            const metrics = await generateMetrics(payload).unwrap()
            setIsAiTyping(false)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: String(t('Готово! Я сгенерировал метрики на основе вашего бизнеса. Переходим к настройке...')),
                time: getTime()
            }])

            // Small delay before transitioning to step 2
            setTimeout(() => {
                onMetricsGenerated(metrics, systemPrompt)
            }, 1200)
        } catch {
            setIsAiTyping(false)
            setIsGenerating(false)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: String(t('Произошла ошибка при генерации. Переходите к следующему шагу вручную.')),
                time: getTime()
            }])
            // Fallback — just go to step 2 after a delay
            setTimeout(() => {
                onMetricsGenerated([], systemPrompt)
            }, 2000)
        }
    }, [generateMetrics, systemPrompt, onMetricsGenerated, t])

    const handleSend = useCallback(() => {
        if (!input.trim() || isAiTyping) return

        const now = getTime()
        setMessages(prev => [...prev, { role: 'user', text: input.trim(), time: now }])

        const updatedPrompt = systemPrompt
            ? `${systemPrompt}\n${input.trim()}`
            : input.trim()
        onChangeSystemPrompt(updatedPrompt)
        setInput('')

        const nextIdx = questionIndex + 1
        if (nextIdx < AI_QUESTIONS.length) {
            setQuestionIndex(nextIdx)
            addAiMessageWithDelay(AI_QUESTIONS[nextIdx])
        } else {
            // Last question answered — trigger generation
            setQuestionIndex(nextIdx)
            // Capture messages including the user's latest reply for the backend
            const allMessages: ChatMessage[] = [...messages, { role: 'user', text: input.trim(), time: now }]
            addAiMessageWithDelay(
                String(t('Отлично! Я собрал достаточно информации. Генерирую метрики...')),
                () => { startGeneration(allMessages) }
            )
        }
    }, [input, isAiTyping, messages, questionIndex, systemPrompt, onChangeSystemPrompt, addAiMessageWithDelay, startGeneration, t])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    const allDone = questionIndex >= AI_QUESTIONS.length

    return (
        <Card variant={'glass'} border={'round'} padding={'0'} max className={cls.chatWrapper}>
            {/* Header */}
            <Card variant={'glass'} border={'normal'} padding={'8'} className={cls.chatHeader}>
                <HStack gap={'12'} align={'center'}>
                    <Card variant={'accent'} border={'round'} padding={'8'} className={cls.chatAvatar}>
                        <SmartToyIcon sx={{ fontSize: 22 }} />
                    </Card>
                    <VStack gap={'4'}>
                        <Text text={'AI Supervisor'} bold size={'s'} />
                        {isAiTyping || isGenerating
                            ? <Text text={isGenerating ? String(t('генерирует метрики...')) : String(t('печатает...'))} size={'s'} variant={'accent'} />
                            : <Text text={String(t('онлайн'))} size={'s'} variant='success' />
                        }
                    </VStack>
                </HStack>
            </Card>

            {/* Messages area */}
            <VStack gap={'8'} className={cls.chatMessages}>
                {messages.map((msg, i) => (
                    <HStack
                        key={i}
                        justify={msg.role === 'user' ? 'end' : 'start'}
                        max
                    >
                        <Card
                            variant={msg.role === 'ai' ? 'accent' : 'success'}
                            border={'partial'}
                            padding={'16'}
                            className={cls.msgBubble}
                        >
                            <VStack gap={'4'}>
                                <Text text={msg.text} size={'s'} />
                                <Text
                                    text={msg.time}
                                    size={'s'}
                                    className={cls.msgTime}
                                />
                            </VStack>
                        </Card>
                    </HStack>
                ))}

                {/* Typing indicator */}
                {isAiTyping && (
                    <HStack justify={'start'} max>
                        <Card variant={'accent'} border={'partial'} padding={'16'} className={cls.msgBubble}>
                            {isGenerating ? (
                                <HStack gap={'8'} align={'center'}>
                                    <AutoAwesomeIcon
                                        sx={{ fontSize: 20, color: 'var(--accent-redesigned)' }}
                                        className={cls.spinIcon}
                                    />
                                    <Text text={String(t('Генерирую метрики...'))} size={'s'} variant={'accent'} />
                                </HStack>
                            ) : (
                                <HStack gap={'4'} align={'center'} className={cls.typingDots}>
                                    <span />
                                    <span />
                                    <span />
                                </HStack>
                            )}
                        </Card>
                    </HStack>
                )}

                <div ref={chatEndRef} />
            </VStack>

            {/* Input bar */}
            <Card variant={'glass'} border={'normal'} padding={'8'} className={cls.chatInputBar}>
                <HStack gap={'8'} align={'center'} max>
                    <Textarea
                        inputRef={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={allDone ? String(t('Метрики генерируются...')) : String(t('Введите сообщение...'))}
                        size={'small'}
                        fullWidth
                        multiline={false}
                        disabled={isAiTyping || allDone}
                    />
                    <Button
                        variant={'clear'}
                        className={cls.chatSendBtn}
                        onClick={handleSend}
                        disabled={!input.trim() || isAiTyping || allDone}
                    >
                        <SendIcon sx={{ fontSize: 20 }} />
                    </Button>
                </HStack>
            </Card>
        </Card>
    )
})
