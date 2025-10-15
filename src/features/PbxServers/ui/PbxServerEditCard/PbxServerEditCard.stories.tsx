import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerEditCard } from './PbxServerEditCard'

export default {
  title: 'shared/PbxServerEditCard',
  component: PbxServerEditCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerEditCard>

const Template: ComponentStory<typeof PbxServerEditCard> = (args) => <PbxServerEditCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
