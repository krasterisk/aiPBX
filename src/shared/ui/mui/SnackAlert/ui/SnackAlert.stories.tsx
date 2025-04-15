import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SnackAlert } from './SnackAlert'

export default {
  title: 'shared/Snackalert',
  component: SnackAlert,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof SnackAlert>

const Template: ComponentStory<typeof SnackAlert> = (args) => <SnackAlert {...args} />

export const Normal = Template.bind({})
Normal.args = {}
