import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsersEditPageAsync as UsersEditPage } from './UsersEditPage.async'

export default {
  title: 'pages/UsersEditPage',
  component: UsersEditPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersEditPage>

const Template: ComponentStory<typeof UsersEditPage> = (args) => <UsersEditPage />

export const Normal = Template.bind({})
Normal.args = {}
