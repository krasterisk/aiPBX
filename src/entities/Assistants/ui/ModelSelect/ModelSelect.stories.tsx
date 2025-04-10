import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ModelSelect } from './ModelSelect'

export default {
  title: 'entities/ModelSelect',
  component: ModelSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ModelSelect>

const Template: ComponentStory<typeof ModelSelect> = (args) => <ModelSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
