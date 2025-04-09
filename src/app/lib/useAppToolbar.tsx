import { AppRoutes } from '@/shared/const/router'
import { ReactElement } from 'react'
import { ScrollToolbar } from '@/widgets/ScrollToolbar'
import { useRouteChange } from '@/shared/lib/router/useRouteChange'

export function useAppToolbar () {
  const appRoute = useRouteChange()
  const toolbarByAppRoute: OptionalRecord<AppRoutes, ReactElement> = {
    [AppRoutes.MAIN]: <ScrollToolbar />
  }

  return toolbarByAppRoute[appRoute]
}
