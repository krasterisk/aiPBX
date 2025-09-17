import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainPageAsync as MainPage } from './MainPage.async'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { Theme } from '@/shared/const/theme'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'

export default {
  title: 'pages/MainPage',
  component: MainPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  decorators: [StoreDecorator({})]
} as ComponentMeta<typeof MainPage>

const Template: ComponentStory<typeof MainPage> = () => <MainPage />

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

export const Purple = Template.bind({})
Purple.args = {}
Purple.decorators = [
  ThemeDecorator(Theme.PURPLE),
  RouterDecorator
]
