import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerEditCardHeader } from './PbxServerEditCardHeader'

export default {
  title: 'shared/PbxServerEditCardHeader',
  component: PbxServerEditCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerEditCardHeader>

const Template: ComponentStory<typeof PbxServerEditCardHeader> = (args) => <PbxServerEditCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
