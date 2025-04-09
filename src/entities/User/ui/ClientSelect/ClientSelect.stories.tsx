import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ClientSelect } from './ClientSelect'

export default {
  title: 'shared/ContextSelect',
  component: ClientSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ClientSelect>

const Template: ComponentStory<typeof ClientSelect> = (args) => <ClientSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
