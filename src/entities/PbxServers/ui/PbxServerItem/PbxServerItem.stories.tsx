import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerItem } from './PbxServerItem'

export default {
  title: 'shared/PbxServerItem',
  component: PbxServerItem,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerItem>

const Template: ComponentStory<typeof PbxServerItem> = (args) => <PbxServerItem {...args} />

export const Normal = Template.bind({})
Normal.args = {}
