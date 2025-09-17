import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ErrorPageAsync as ErrorPage } from './ErrorPage.async'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { Theme } from '@/shared/const/theme'

export default {
  title: 'pages/ForbiddenPage',
  component: ErrorPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ErrorPage>

const Template: ComponentStory<typeof ErrorPage> = () => <ErrorPage />

export const Normal = Template.bind({})
Normal.args = {}

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [ThemeDecorator(Theme.DARK)]
