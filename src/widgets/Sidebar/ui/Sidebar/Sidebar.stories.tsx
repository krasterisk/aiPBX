import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { Sidebar } from './Sidebar'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { Theme } from '@/shared/const/theme'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'

export default {
  title: 'widgets/Sidebar',
  component: Sidebar,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Sidebar>

const Template: ComponentStory<typeof Sidebar> = (args) => <Sidebar {...args} />

export const Light = Template.bind({})
Light.args = {}
Light.decorators = [
  StoreDecorator({
    user: { authData: {} }
  }),
  RouterDecorator
]

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [
  ThemeDecorator(Theme.DARK),
  StoreDecorator({
    user: { authData: {} }
  }),
  RouterDecorator
]

export const NoAuth = Template.bind({})
NoAuth.args = {}
NoAuth.decorators = [
  StoreDecorator({
    user: {}
  }),
  RouterDecorator
]
