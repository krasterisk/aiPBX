import React from 'react'
import { componentRender } from '@/shared/lib/tests/componentRender/componentRender'
import AppRouter from './AppRouter'
import { getRouteAbout, getRouteAdmin, getRoutePayment, getRouteDashboardCallRecords, getRouteDashboardCallRecordsPreview, getRouteCalls, getRouteCallsPreview } from '@/shared/const/router'
import { UserRolesValues } from '@/entities/User'
import { screen } from '@testing-library/react'

jest.mock('@/pages/MainPage', () => ({
  MainPage: () => <main data-testid="MainPage" />,
}))

jest.mock('@/pages/PaymentPage', () => ({
  PaymentPage: () => <main data-testid="PaymentPage" />,
}))

jest.mock('@/pages/DashboardCallRecordsPreviewPage', () => ({
  DashboardCallRecordsPreviewPage: () => <main data-testid="ReviewedCallRecordsDashboard" />,
}))

jest.mock('@/pages/CallsPage', () => ({ CallsPage: () => <main data-testid="LegacyCalls" /> }))
jest.mock('@/pages/CallsPreviewPage', () => ({ CallsPreviewPage: () => <main data-testid="PreviewCalls" data-path={jest.requireActual('react-router-dom').useLocation().pathname} /> }))

describe('app/router/AppRouter', function () {
  test.each([[getRouteCalls(), 'PreviewCalls'], [getRouteCallsPreview(), 'PreviewCalls']])('serves the new journal through primary and preview routes: %s', async (route, testId) => {
    componentRender(<AppRouter />, { route, initialState: { user: { authData: { id: '99', roles: [{ value: UserRolesValues.USER }] }, _mounted: true } } })
    expect(await screen.findByTestId(testId)).toBeInTheDocument()
    expect(screen.getByTestId(testId)).toHaveAttribute('data-path', getRouteCalls())
  })
  test.each([getRouteCalls(), getRouteCallsPreview()])('requires authentication for journal route %s', async route => {
    componentRender(<AppRouter />, { route, initialState: {} })
    expect(await screen.findByTestId('MainPage')).toBeInTheDocument()
    expect(screen.queryByTestId('PreviewCalls')).not.toBeInTheDocument()
  })
  test.each([getRouteDashboardCallRecords(), getRouteDashboardCallRecordsPreview()])('serves the reviewed dashboard at %s for an authenticated user', async route => {
    componentRender(<AppRouter />, { route, initialState: { user: { authData: { id: '99', username: 'test', roles: [{ value: UserRolesValues.USER }] }, _mounted: true } } })
    expect(await screen.findByTestId('ReviewedCallRecordsDashboard')).toBeInTheDocument()
  })
  test('keeps authentication required for the main call-records dashboard', async () => {
    componentRender(<AppRouter />, { route: getRouteDashboardCallRecords(), initialState: {} })
    expect(await screen.findByTestId('MainPage')).toBeInTheDocument()
    expect(screen.queryByTestId('ReviewedCallRecordsDashboard')).not.toBeInTheDocument()
  })
  test('Page must be render', async () => {
    componentRender(<AppRouter/>, {
      route: getRouteAbout()
    })
    const page = await screen.findByTestId('AboutPage')
    expect(page).toBeInTheDocument()
  })
  test('Page not found', async () => {
    componentRender(<AppRouter/>, {
      route: '/notrealpage'
    })
    const page = await screen.findByTestId('ErrorPage')
    expect(page).toBeInTheDocument()
  })
  test('Redirect not auth user to MainPage', async () => {
    componentRender(<AppRouter/>, {
      route: getRoutePayment(),
      initialState: {}
    })
    const page = await screen.findByTestId('MainPage')
    expect(page).toBeInTheDocument()
  })
  test('Payment page for auth user', async () => {
    componentRender(<AppRouter/>, {
      route: getRoutePayment(),
      initialState: {
        user: {
          authData: {
            id: '1',
            username: 'test',
            roles: [{ value: UserRolesValues.USER }],
          },
          _mounted: true
        }
      }
    })
    const page = await screen.findByTestId('PaymentPage')
    expect(page).toBeInTheDocument()
  })

  test('User role not found', async () => {
    componentRender(<AppRouter/>, {
      route: getRouteAdmin(),
      initialState: {
        user: {
          authData: {
            id: '10',
            username: 'test',
            password: 'test',
            token: ''
          },
          _mounted: true
        }
      }
    })
    const page = await screen.findByTestId('ForbiddenPage')
    expect(page).toBeInTheDocument()
  })
  test('User admin found', async () => {
    componentRender(<AppRouter/>, {
      route: getRouteAdmin(),
      initialState: {
        user: {
          authData: {
            id: '1',
            username: 'test',
            roles: [{ value: UserRolesValues.ADMIN }],
          },
          _mounted: true
        }
      }
    })
    const page = await screen.findByTestId('AdminPage')
    expect(page).toBeInTheDocument()
  })
})
