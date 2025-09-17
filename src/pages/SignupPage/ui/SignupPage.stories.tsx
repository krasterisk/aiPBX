import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SignupPageAsync as SignupPage } from './SignupPage.async'

export default {
  title: 'shared/SignupPage',
  component: SignupPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof SignupPage>

const Template: ComponentStory<typeof SignupPage> = (args) => <SignupPage />

export const Normal = Template.bind({})
Normal.args = {}
