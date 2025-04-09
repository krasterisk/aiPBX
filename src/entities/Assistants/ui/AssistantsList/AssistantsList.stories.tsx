import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantsList } from './AssistantsList'

export default {
  title: 'entities/TerminalsList',
  component: AssistantsList,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantsList>

const Template: ComponentStory<typeof AssistantsList> = (args) => <AssistantsList {...args} />

export const Normal = Template.bind({})
Normal.args = {}
