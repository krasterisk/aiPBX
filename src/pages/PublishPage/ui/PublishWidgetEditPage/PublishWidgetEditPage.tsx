import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useEffect, useRef } from 'react'
import { Page } from '@/widgets/Page'
import { PublishWidgetsForm, publishWidgetsFormReducer, publishWidgetsFormActions } from '@/features/PublishWidgets'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useParams } from 'react-router-dom'
import { useWidgetKey } from '@/entities/WidgetKeys'
import { Loader } from '@/shared/ui/Loader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

interface PublishWidgetEditPageProps {
    className?: string
}

const reducers: ReducersList = {
    publishWidgetsForm: publishWidgetsFormReducer
}

/**
 * Inner component that runs INSIDE DynamicModuleLoader,
 * so the publishWidgetsForm reducer is guaranteed to be registered
 * before we dispatch initForm.
 */
const PublishWidgetEditContent = memo(({ className }: { className?: string }) => {
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const { data: widget, isLoading } = useWidgetKey(Number(id), { skip: !id })

    // Track whether we have already initialized the form for THIS mount.
    // DynamicModuleLoader with removeAfterUnmount destroys the slice state
    // on unmount, but RTK Query may return the same cached `widget` reference
    // on next mount, so useEffect([widget]) wouldn't re-fire.
    const initializedRef = useRef(false)

    useEffect(() => {
        // Reset flag on every mount so we re-init from API data
        initializedRef.current = false
        return () => {
            // Clean up form state when leaving the page
            dispatch(publishWidgetsFormActions.resetForm())
        }
    }, [dispatch])

    useEffect(() => {
        if (widget && !initializedRef.current) {
            dispatch(publishWidgetsFormActions.initForm(widget))
            initializedRef.current = true
        }
    }, [widget, dispatch])

    if (isLoading) {
        return <Loader />
    }

    return (
        <PublishWidgetsForm isEdit widgetId={id} />
    )
})

const PublishWidgetEditPage = memo((props: PublishWidgetEditPageProps) => {
    const { className } = props

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <PublishWidgetEditContent className={className} />
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishWidgetEditPage
