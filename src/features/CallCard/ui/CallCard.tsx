import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import cls from './CallCard.module.scss'
import { useReportDialog } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'
import { Divider } from '@/shared/ui/Divider'

interface CallCardProps {
  channelId: string
  callerId: string
  assistant: string
  events: any[]
}

export const CallCard = ({ channelId, callerId, assistant, events }: CallCardProps) => {
  const [now, setNow] = useState(Date.now())
  const [showEvents, setShowEvents] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({})

  const createdAtRef = useRef<number | null>(null)
  if (!createdAtRef.current && events.length > 0) {
    createdAtRef.current = Date.now()
  }

  useEffect(() => {
    const interval = setInterval(() => { setNow(Date.now()) }, 1000)
    return () => { clearInterval(interval) }
  }, [])

  const responseDoneEvent = [...events].reverse().find(e => e.type === 'response.done')
  const totalTokens = responseDoneEvent?.response?.usage?.total_tokens ?? 0

  const elapsedMs = createdAtRef.current ? now - createdAtRef.current : 0
  const minutes = Math.floor(elapsedMs / 60000)
  const seconds = Math.floor((elapsedMs % 60000) / 1000)
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const { t } = useTranslation('reports')

  // const toggleEventJson = (eventId: string) => {
  //   setExpandedEventIds(prev => ({
  //     ...prev,
  //     [eventId]: !prev[eventId]
  //   }))
  // }

  // Собираем диалог
  const dialogMessages = useReportDialog(events)

  return (
        <Card
            border={'partial'}
            variant={'outlined'}
            padding={'8'}
            max
            className={classNames(cls.CallCard, {}, [])}
        >
          <HStack gap={'8'} wrap={'wrap'} justify={'between'} max>
            {channelId ? <Text text={channelId}/> : ''}
            {assistant ? <Text text={assistant}/> : ''}
              {callerId ? <Text text={callerId}/> : ''}
              {formattedTime ? <Text text={formattedTime}/> : ''}
              <Text text={t('Токены')}/>
              {totalTokens ? <Text text={String(totalTokens)}/> : '0'}
            <Button
                variant={'clear'}
                addonRight={
                  showDialog
                    ? <ExpandLessIcon fontSize={'large'}/>
                    : <ExpandMoreIcon fontSize={'large'}/>
                }
                onClick={() => { setShowDialog(prev => !prev) }}
            />
          </HStack>

          {/* {showEvents && ( */}
          {/*    <div className="mt-4 space-y-2"> */}
          {/*      {events.map((event) => ( */}
          {/*          <div key={event.event_id}> */}
          {/*            <div */}
          {/*                onClick={() => { toggleEventJson(event.event_id) }} */}
          {/*                className="cursor-pointer text-blue-400 hover:underline" */}
          {/*            > */}
          {/*              🧾 {event.type} */}
          {/*            </div> */}
          {/*            {expandedEventIds[event.event_id] && ( */}
          {/*                <pre className="bg-gray-900 text-green-400 text-xs mt-1 p-2 rounded overflow-x-auto"> */}
          {/*          {JSON.stringify(event, null, 2)} */}
          {/*        </pre> */}
          {/*            )} */}
          {/*          </div> */}
          {/*      ))} */}
          {/*    </div> */}
          {/* )} */}

          {showDialog && (
          <VStack gap="16" className={cls.eventsContainer} wrap={'wrap'}>

            <Divider />
            {dialogMessages?.length === 0 &&
            <HStack max justify={'center'}>
                <Text text={t('Диалог отсутствует')}/>
            </HStack>
            }
            {dialogMessages?.map((dialog, index) => (
                <HStack
                    key={index}
                    gap={'16'}
                    justify={'between'} max
                >

                  <VStack
                      gap={'4'}
                      justify={'start'}
                  >
                    <Text
                        text={dialog.role}
                        variant={dialog.role === 'User' ? 'accent' : 'success'}
                        size={'m'}
                    />
                  </VStack>

                  <Card border={'partial'} variant={dialog.role === 'User' ? 'outlined' : 'success'}>
                    <Text text={dialog.text}/>
                  </Card>
                </HStack>
            ))}
          </VStack>
          )}
      </Card>
  )
}
