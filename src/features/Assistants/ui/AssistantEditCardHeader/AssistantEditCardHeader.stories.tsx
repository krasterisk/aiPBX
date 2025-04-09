import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantEditCardHeader } from './AssistantEditCardHeader'

export default {
  title: 'shared/TerminalEditCardHeader',
  component: AssistantEditCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantEditCardHeader>

const Template: ComponentStory<typeof AssistantEditCardHeader> = (args) => <AssistantEditCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
