import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import cls from './ProjectWizard.module.scss'

interface ChatMessage {
    role: 'ai' | 'user'
    text: string
}

const AI_QUESTIONS = [
    'Расскажите о своём бизнесе. Чем занимается ваша компания?',
    'Какие основные задачи решают ваши операторы по телефону?',
    'Что для вас самое важное в качестве обслуживания?',
    'Нужно ли проверять допродажи или кросс-продажи?',
]

interface WizardStep1Props {
    systemPrompt: string
    onChangeSystemPrompt: (value: string) => void
    onGenerateMetrics: () => void
}

export const WizardStep1_Chat = memo(({ systemPrompt, onChangeSystemPrompt, onGenerateMetrics }: WizardStep1Props) => {
    const { t } = useTranslation('reports')
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'ai', text: AI_QUESTIONS[0] }
    ])
    const [input, setInput] = useState('')
    const [questionIndex, setQuestionIndex] = useState(0)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = useCallback(() => {
        if (!input.trim()) return

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: input.trim() }]

        // Accumulate user responses into systemPrompt
        const updatedPrompt = systemPrompt
            ? `${systemPrompt}\n${input.trim()}`
            : input.trim()
        onChangeSystemPrompt(updatedPrompt)

        const nextIdx = questionIndex + 1
        if (nextIdx < AI_QUESTIONS.length) {
            newMessages.push({ role: 'ai', text: AI_QUESTIONS[nextIdx] })
            setQuestionIndex(nextIdx)
        } else {
            newMessages.push({ role: 'ai', text: String(t('Отлично! Я собрал достаточно информации. Нажмите «Сгенерировать метрики» для продолжения.')) })
        }

        setMessages(newMessages)
        setInput('')
    }, [input, messages, questionIndex, systemPrompt, onChangeSystemPrompt, t])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    return (
        <VStack gap={'16'} max>
            <Text title={String(t('AI Интервью'))} bold />
            <Text text={String(t('Расскажите о бизнесе'))} />

            <div className={cls.chatContainer} ref={chatRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`${cls.chatBubble} ${cls[msg.role]}`}>
                        {msg.role === 'ai' && <SmartToyIcon sx={{ fontSize: 16, marginRight: '6px', verticalAlign: 'middle', color: 'var(--accent-redesigned)' }} />}
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className={cls.chatInputRow}>
                <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={String(t('Введите ответ...'))}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
                <Button variant={'glass-action'} onClick={handleSend} disabled={!input.trim()}>
                    {String(t('Отправить'))}
                </Button>
            </div>

            {questionIndex >= AI_QUESTIONS.length - 1 && (
                <Button variant={'glass-action'} onClick={onGenerateMetrics} fullWidth>
                    {'✨ ' + String(t('Сгенерировать метрики'))}
                </Button>
            )}
        </VStack>
    )
})
