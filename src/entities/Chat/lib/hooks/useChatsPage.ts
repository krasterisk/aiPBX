import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getChatsPageSearch,
  getChatsFormOpen,
  getChatsEditingChat
} from '../../model/selectors/chatsSelectors'
import { chatsPageActions } from '../../model/slices/chatsPageSlice'
import { useChats } from '../../api/chatApi'
import { Chat } from '../../model/types/chat'

export function useChatsPage () {
  const search = useSelector(getChatsPageSearch)
  const isFormOpen = useSelector(getChatsFormOpen)
  const editingChat = useSelector(getChatsEditingChat)
  const dispatch = useAppDispatch()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useChats(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  const filteredData = useMemo(() => {
    if (!data || !search) return data
    const lowerSearch = search.toLowerCase()
    return data.filter(
      (chat) =>
        chat.name.toLowerCase().includes(lowerSearch) ||
        (chat.model && chat.model.toLowerCase().includes(lowerSearch))
    )
  }, [data, search])

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onChangeSearch = useCallback((value: string) => {
    dispatch(chatsPageActions.setSearch(value))
  }, [dispatch])

  const onOpenCreate = useCallback(() => {
    dispatch(chatsPageActions.openCreateForm())
  }, [dispatch])

  const onOpenEdit = useCallback((chat: Chat) => {
    dispatch(chatsPageActions.openEditForm(chat))
  }, [dispatch])

  const onCloseForm = useCallback(() => {
    dispatch(chatsPageActions.closeForm())
  }, [dispatch])

  return {
    data: filteredData,
    isLoading,
    isError,
    error,
    search,
    isFormOpen,
    editingChat,
    onChangeSearch,
    onRefetch,
    onOpenCreate,
    onOpenEdit,
    onCloseForm
  }
}
