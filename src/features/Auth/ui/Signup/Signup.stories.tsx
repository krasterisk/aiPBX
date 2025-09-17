import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Signup } from './Signup'

export default {
  title: 'shared/Signup',
  component: Signup,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Signup>

const Template: ComponentStory<typeof Signup> = (args) => <Signup {...args} />

export const Normal = Template.bind({})
Normal.args = {}
