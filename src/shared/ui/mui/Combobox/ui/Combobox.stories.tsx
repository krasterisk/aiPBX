import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Combobox } from './Combobox'

export default {
  title: 'shared/Combobox',
  component: Combobox,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Combobox>

const Template: ComponentStory<typeof Combobox> = (args) => <Combobox {...args} />

export const Normal = Template.bind({})
Normal.args = {}
