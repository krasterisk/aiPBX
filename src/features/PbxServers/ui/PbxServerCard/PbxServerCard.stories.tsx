import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerCard } from './PbxServerCard'

export default {
  title: 'shared/PbxServerCard',
  component: PbxServerCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerCard>

const Template: ComponentStory<typeof PbxServerCard> = (args) => <PbxServerCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
