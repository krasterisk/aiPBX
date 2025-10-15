import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerCreateCardHeader } from './PbxServerCreateCardHeader'

export default {
  title: 'shared/PbxServerCreateCardHeader',
  component: PbxServerCreateCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerCreateCardHeader>

const Template: ComponentStory<typeof PbxServerCreateCardHeader> = (args) => <PbxServerCreateCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
