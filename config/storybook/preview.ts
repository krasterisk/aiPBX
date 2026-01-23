import { StyleDecorator } from '../../src/shared/config/storybook/StyleDecorator/StyleDecorator'
import { ThemeDecorator } from '../../src/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { RouterDecorator } from '../../src/shared/config/storybook/RouterDecorator/RouterDecorator'
import {
  SuspenseDecorator
} from '../../src/shared/config/storybook/SuspenseDecorator/SuspenseDecorator'
import { Theme } from '../../src/shared/const/theme'
import '../../src/app/styles/index.scss'
import { Preview } from '@storybook/react'
import { FeaturesFlagsDecorator } from '../../src/shared/config/storybook/FeaturesFlagsDecorator/FeaturesFlagsDecorator'

export const decorators = [
  FeaturesFlagsDecorator({ isAppRedesigned: false }),
  StyleDecorator,
  ThemeDecorator(Theme.LIGHT),
  RouterDecorator,
  SuspenseDecorator
]

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    layout: 'fullscreen',
    themes: {
      default: 'light',
      list: [
        {
          name: 'light',
          class: Theme.LIGHT,
          color: '#ffffff'
        },
        {
          name: 'dark',
          class: Theme.DARK,
          color: '#000000'
        }
      ]
    }
  }
}

export default preview
