import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantsListHeader } from './AssistantsListHeader'

export default {
  title: 'entities/AssistantsListHeader',
  component: AssistantsListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantsListHeader>

const Template: ComponentStory<typeof AssistantsListHeader> = (args) => <AssistantsListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
