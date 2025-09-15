import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Login } from './Login'

export default {
  title: 'features/Login',
  component: Login,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Login>

const Template: ComponentStory<typeof Login> = (args) => <Login {...args} />

export const Normal = Template.bind({})
Normal.args = {}
