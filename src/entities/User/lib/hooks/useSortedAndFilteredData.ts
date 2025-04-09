import { useState, useEffect } from 'react'
import { UserSortField } from '../../model/consts/consts'
import { User } from '../../model/types/user'

export function useSortedAndFilteredData (data: User[] = [], sort: UserSortField, search?: string) {
  const [sortedAndFilteredData, setSortedAndFilteredData] = useState<User[]>([])

  useEffect(() => {
    let result = [...data]

    if (sort) {
      result.sort((a, b) => String(a[sort]).localeCompare(String(b[sort])))
    }
    if (search) {
      result = result.filter(item => {
        return Object.keys(item).some(key =>
          key !== 'id' &&
                    item[key as keyof User] &&
                    String(item[key as keyof User]).toLowerCase().includes(search.toLowerCase())
        )
      })
    }
    setSortedAndFilteredData(result)
  }, [data, search, sort])

  return sortedAndFilteredData
}
