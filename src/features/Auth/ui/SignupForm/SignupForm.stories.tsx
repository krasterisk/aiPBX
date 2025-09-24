import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SignupForm } from './SignupForm'

export default {
  title: 'shared/SignupForm',
  component: SignupForm,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof SignupForm>

const Template: ComponentStory<typeof SignupForm> = (args) => <SignupForm {...args} />

export const Normal = Template.bind({})
Normal.args = {}
