import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AddCommentForm.module.scss'
import { useTranslation } from 'react-i18next'
import { memo, useCallback } from 'react'
import { Input as InputDeprecated } from '@/shared/ui/deprecated/Input'
import { Input } from '@/shared/ui/redesigned/Input'
import { Button as ButtonDeprecated, ButtonTheme } from '@/shared/ui/deprecated/Button'
import { Button } from '@/shared/ui/redesigned/Button'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { AddCommentFormActions, AddCommentFormReducer } from '../../model/slice/AddCommentFormSlice'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { addCommentFormText } from '../../model/selectors/addCommentFormSelectors'
import { ToggleFeatures } from '@/shared/lib/features'
import { Card } from '@/shared/ui/redesigned/Card'

export interface AddCommentFormProps {
  className?: string
  onSendComment: (text: string) => void
}

const reducers: ReducersList = {
  addCommentForm: AddCommentFormReducer
}

const AddCommentForm = memo((props: AddCommentFormProps) => {
  const {
    className,
    onSendComment
  } = props

  const { t } = useTranslation('manuals')
  const text = useSelector(addCommentFormText)
  //    const error = useSelector(addCommentFormError)
  const dispatch = useAppDispatch()

  const onCommentTextChange = useCallback((value: string) => {
    dispatch(AddCommentFormActions.setText(value))
  }, [dispatch])

  const onSendHandler = useCallback(() => {
    onSendComment(text || '')
    onCommentTextChange('')
  }, [onCommentTextChange, onSendComment, text])

  return (
        <DynamicModuleLoader reducers={reducers}>
            <ToggleFeatures
                feature={'isAppRedesigned'}
                on={
                    <Card padding={'24'} border={'partial'} max>
                        <HStack
                            data-testid={'AddCommentForm'}
                            gap='16'
                            justify='between'
                            max
                            className={classNames(cls.AddCommentFormRedesigned, {}, [className])}
                        >
                            <Input
                                data-testid={'AddCommentForm.Input'}
                                className={cls.input}
                                placeholder={t('Введите текст комментария') ?? ''}
                                value={text}
                                onChange={onCommentTextChange}
                            />
                            <Button
                                data-testid={'AddCommentForm.Button'}
                                onClick={onSendHandler}
                                variant={'outline'}>{t('Отправить')}
                            </Button>
                        </HStack>
                    </Card>
                }
                off={
                    <HStack
                        data-testid={'AddCommentForm'}
                        gap='8'
                        justify='between'
                        max
                        className={classNames(cls.AddCommentForm, {}, [className])}
                    >
                        <InputDeprecated
                            data-testid={'AddCommentForm.Input'}
                            className={cls.input}
                            placeholder={t('Введите текст комментария')}
                            value={text}
                            onChange={onCommentTextChange}
                        />
                        <ButtonDeprecated
                            data-testid={'AddCommentForm.Button'}
                            onClick={onSendHandler}
                            theme={ButtonTheme.OUTLINE}>{t('Отправить')}
                        </ButtonDeprecated>
                    </HStack>
                }
            />
        </DynamicModuleLoader>
  )
})

export default AddCommentForm
