import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import UsersCreatePage from './UsersCreatePage'

export default {
  title: 'pages/UsersCreatePage',
  component: UsersCreatePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersCreatePage>

const Template: ComponentStory<typeof UsersCreatePage> = (args) => <UsersCreatePage />

export const Normal = Template.bind({})
Normal.args = {}
