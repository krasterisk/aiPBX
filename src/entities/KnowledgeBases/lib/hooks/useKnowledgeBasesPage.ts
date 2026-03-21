import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getKBPageSearch,
  getKBFormOpen,
  getKBEditingKb
} from '../../model/selectors/knowledgeBasesSelectors'
import { knowledgeBasesPageActions } from '../../model/slices/knowledgeBasesPageSlice'
import { useKnowledgeBases } from '../../api/knowledgeBaseApi'
import { KnowledgeBase } from '../../model/types/knowledgeBase'

export function useKnowledgeBasesPage () {
  const search = useSelector(getKBPageSearch)
  const isFormOpen = useSelector(getKBFormOpen)
  const editingKb = useSelector(getKBEditingKb)
  const dispatch = useAppDispatch()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useKnowledgeBases(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  const filteredData = useMemo(() => {
    if (!data || !search) return data
    const lowerSearch = search.toLowerCase()
    return data.filter(
      (kb) =>
        kb.name.toLowerCase().includes(lowerSearch) ||
        (kb.description && kb.description.toLowerCase().includes(lowerSearch))
    )
  }, [data, search])

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onChangeSearch = useCallback((value: string) => {
    dispatch(knowledgeBasesPageActions.setSearch(value))
  }, [dispatch])

  const onOpenCreate = useCallback(() => {
    dispatch(knowledgeBasesPageActions.openCreateForm())
  }, [dispatch])

  const onOpenEdit = useCallback((kb: KnowledgeBase) => {
    dispatch(knowledgeBasesPageActions.openEditForm(kb))
  }, [dispatch])

  const onCloseForm = useCallback(() => {
    dispatch(knowledgeBasesPageActions.closeForm())
  }, [dispatch])

  return {
    data: filteredData,
    isLoading,
    isError,
    error,
    search,
    isFormOpen,
    editingKb,
    onChangeSearch,
    onRefetch,
    onOpenCreate,
    onOpenEdit,
    onCloseForm
  }
}
