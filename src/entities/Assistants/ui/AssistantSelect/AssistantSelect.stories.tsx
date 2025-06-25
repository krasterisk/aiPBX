import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantSelect } from './AssistantSelect'

export default {
  title: 'entities/AssistantSelect',
  component: AssistantSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantSelect>

const Template: ComponentStory<typeof AssistantSelect> = (args) => <AssistantSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
