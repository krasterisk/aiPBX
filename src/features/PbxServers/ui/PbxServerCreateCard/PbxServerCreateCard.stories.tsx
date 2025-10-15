import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerCreateCard } from './PbxServerCreateCard'

export default {
  title: 'shared/PbxServerCreateCard',
  component: PbxServerCreateCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerCreateCard>

const Template: ComponentStory<typeof PbxServerCreateCard> = (args) => <PbxServerCreateCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
