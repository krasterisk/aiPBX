import React from 'react'
import { componentRender } from '@/shared/lib/tests/componentRender/componentRender'
import AppRouter from './AppRouter'
import { getRouteAbout, getRouteAdmin, getRoutePayment } from '@/shared/const/router'
import { UserRolesValues } from '@/entities/User'
import { screen } from '@testing-library/react'

jest.mock('@/pages/MainPage', () => ({
  MainPage: () => <main data-testid="MainPage" />,
}))

jest.mock('@/pages/PaymentPage', () => ({
  PaymentPage: () => <main data-testid="PaymentPage" />,
}))

describe('app/router/AppRouter', function () {
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
