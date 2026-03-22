import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ChatPage.module.scss'
import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { useChatById } from '@/entities/Chat'
import type { ChatToolCall } from '@/entities/Chat'
import { getRouteChats } from '@/shared/const/router'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft,
  Send,
  Square,
  Trash2,
  MessageCircle,
  User,
  Bot,
  Search,
  Link
} from 'lucide-react'

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ChatToolCall[]
}

const ChatPage = () => {
  const { t } = useTranslation('aichat')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: chat, isLoading: chatLoading } = useChatById(Number(id))

  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const buildHistory = useCallback((): Array<{ role: string, content: string }> => {
    return messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  }, [messages])

  const handleSend = useCallback(async () => {
    const message = inputValue.trim()
    if (!message || !id) return

    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const history = buildHistory()
    const userMessage: DisplayMessage = { role: 'user', content: message }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsStreaming(true)

    const assistantMessage: DisplayMessage = {
      role: 'assistant',
      content: '',
      toolCalls: []
    }
    setMessages(prev => [...prev, assistantMessage])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
      const response = await fetch(`${__API__}/chats/${id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message, history }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const events = buffer.split('\n\n')
        buffer = events.pop()!

        for (const event of events) {
          if (!event.trim()) continue

          const lines = event.split('\n')
          let eventType = ''
          let eventData = ''

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7)
            } else if (line.startsWith('data: ')) {
              eventData = line.slice(6)
            }
          }

          switch (eventType) {
            case 'text': {
              let textChunk: string
              try {
                textChunk = JSON.parse(eventData)
              } catch {
                textChunk = eventData
              }
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last && last.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + textChunk
                  }
                }
                return updated
              })
              break
            }
            case 'tool_call': {
              try {
                const data = JSON.parse(eventData)
                setMessages(prev => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {
                      ...last,
                      toolCalls: [
                        ...(last.toolCalls || []),
                        { name: data.name, status: 'calling' }
                      ]
                    }
                  }
                  return updated
                })
              } catch { /* ignore */ }
              break
            }
            case 'tool_result': {
              try {
                const data = JSON.parse(eventData)
                setMessages(prev => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last && last.role === 'assistant' && last.toolCalls) {
                    const toolCalls = last.toolCalls.map(tc =>
                      tc.name === data.name ? { ...tc, status: 'done' as const, result: data.result } : tc
                    )
                    updated[updated.length - 1] = { ...last, toolCalls }
                  }
                  return updated
                })
              } catch { /* ignore */ }
              break
            }
            case 'done': {
              break
            }
            case 'error': {
              try {
                const errData = JSON.parse(eventData)
                setMessages(prev => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + `\n\n❌ ${errData.message || errData}`
                    }
                  }
                  return updated
                })
              } catch { /* ignore */ }
              break
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: last.content || `❌ ${t('Ошибка')}: ${err.message}`
            }
          }
          return updated
        })
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [inputValue, id, isStreaming, buildHistory, t])

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  const handleClear = useCallback(() => {
    setMessages([])
    setInputValue('')
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [isStreaming])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) {
        handleStop()
      } else {
        handleSend()
      }
    }
  }, [isStreaming, handleStop, handleSend])

  if (chatLoading) {
    return (
      <Page className={cls.ChatPage}>
        <VStack max justify="center" align="center" className={cls.loadingWrap}>
          <Text text={t('Загрузка...')} variant="accent" />
        </VStack>
      </Page>
    )
  }

  return (
    <Page data-testid="ChatPage" className={cls.ChatPage}>
      {/* Header */}
      <HStack max justify="between" align="center" gap="8" className={cls.headerCard}>
        <HStack gap="8" align="center">
          <HStack
            gap="4"
            align="center"
            className={cls.backBtn}
            onClick={() => { navigate(getRouteChats()) }}
          >
            <ArrowLeft size={18} />
          </HStack>
          <div className={cls.chatAvatar}>
            <MessageCircle size={16} />
          </div>
          <Text title={chat?.name} size="m" bold />
        </HStack>
        <Button
          variant="glass-action"
          size="s"
          onClick={handleClear}
          addonLeft={<Trash2 size={14} />}
        >
          {t('Очистить историю')}
        </Button>
      </HStack>

      {/* Messages area */}
      <VStack max className={cls.messagesArea}>
        {messages.length === 0 && (
          <VStack justify="center" align="center" max className={cls.welcome} gap="8">
            <div className={cls.welcomeIcon}>
              <MessageCircle size={48} />
            </div>
            <Text title={chat?.name} size="l" bold align="center" />
            <Text text={t('Задайте ваш вопрос')} variant="accent" align="center" />
          </VStack>
        )}

        {messages.map((msg, idx) => (
          <HStack
            key={idx}
            gap="12"
            max
            align="start"
            className={classNames(
              cls.messageBubble,
              { [cls.userBubble]: msg.role === 'user' },
              []
            )}
          >
            <div className={cls.bubbleAvatar}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <VStack gap="8" max className={cls.bubbleContent}>
              {/* Tool call indicators */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <HStack gap="8" wrap="wrap">
                  {msg.toolCalls.map((tc, tIdx) => (
                    <HStack
                      key={tIdx}
                      gap="4"
                      align="center"
                      className={classNames(
                        cls.toolChip,
                        { [cls.toolChipCalling]: tc.status === 'calling' },
                        []
                      )}
                    >
                      {tc.name.includes('knowledge') || tc.name.includes('search')
                        ? <Search size={12} />
                        : <Link size={12} />}
                      <Text
                        text={tc.status === 'calling'
                          ? (tc.name.includes('knowledge') || tc.name.includes('search')
                            ? t('Ищу в базе знаний...')
                            : t('Запрашиваю данные...'))
                          : (tc.name.includes('knowledge') || tc.name.includes('search')
                            ? t('Поиск завершён')
                            : t('Данные получены'))}
                        size="xs"
                      />
                    </HStack>
                  ))}
                </HStack>
              )}

              {/* Message content */}
              {msg.role === 'assistant' ? (
                <VStack max className={cls.markdownContent}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                  {isStreaming && idx === messages.length - 1 && (
                    <span className={cls.cursor}>█</span>
                  )}
                </VStack>
              ) : (
                <Text text={msg.content} />
              )}
            </VStack>
          </HStack>
        ))}

        <div ref={messagesEndRef} />
      </VStack>

      {/* Input area */}
      <HStack gap="8" align="center" className={cls.inputArea}>
        <div className={cls.inputField}>
          <Textarea
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value) }}
            onKeyDown={handleKeyDown}
            placeholder={t('Введите сообщение...') ?? ''}
            multiline
            minRows={1}
            maxRows={4}
            size="small"
            disabled={chatLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent !important',
                minHeight: '40px',
                padding: '6px 0',
                '& fieldset': { border: 'none !important' },
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  '& fieldset': { border: 'none !important' }
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent !important',
                  boxShadow: 'none',
                  '& fieldset': { border: 'none !important' }
                },
                '&.MuiInputBase-multiline': {
                  minHeight: '40px',
                  padding: '6px 0',
                  alignItems: 'center'
                }
              }
            }}
          />
        </div>
        {isStreaming ? (
          <button
            className={cls.sendBtnCircle}
            onClick={handleStop}
            type="button"
          >
            <Square size={16} />
          </button>
        ) : (
          inputValue.trim() && (
            <button
              className={cls.sendBtnCircle}
              onClick={handleSend}
              type="button"
            >
              <Send size={16} />
            </button>
          )
        )}
      </HStack>
    </Page>
  )
}

export default memo(ChatPage)
