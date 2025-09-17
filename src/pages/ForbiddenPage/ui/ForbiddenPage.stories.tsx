import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ForbiddenPageAsync as ForbiddenPage } from './ForbiddenPage.async'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { Theme } from '@/shared/const/theme'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'

export default {
  title: 'pages/ForbiddenPage',
  component: ForbiddenPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ForbiddenPage>

const Template: ComponentStory<typeof ForbiddenPage> = () => <ForbiddenPage />

export const Normal = Template.bind({})
Normal.args = {}
Normal.decorators = [
  StoreDecorator({}),
  RouterDecorator
]

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [
  StoreDecorator({}),
  ThemeDecorator(Theme.DARK),
  RouterDecorator
]
