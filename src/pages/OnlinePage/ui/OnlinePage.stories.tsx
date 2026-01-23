import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { Theme } from '@/shared/const/theme'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'
import { OnlinePageAsync as OnlinePage } from './OnlinePage.async'

export default {
  title: 'pages/OnlinePage',
  component: OnlinePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  decorators: [StoreDecorator({})]
} as ComponentMeta<typeof OnlinePage>

const Template: ComponentStory<typeof OnlinePage> = () => <OnlinePage />

export const Normal = Template.bind({})
Normal.args = {}
Normal.decorators = [
  RouterDecorator
]

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [
  ThemeDecorator(Theme.DARK),
  RouterDecorator
]

