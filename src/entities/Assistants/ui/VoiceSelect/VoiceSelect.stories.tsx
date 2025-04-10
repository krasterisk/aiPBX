import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { VoiceSelect } from './VoiceSelect'

export default {
  title: 'entities/VoiceSelect',
  component: VoiceSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof VoiceSelect>

const Template: ComponentStory<typeof VoiceSelect> = (args) => <VoiceSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
