import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServersListHeader } from './PbxServersListHeader'

export default {
  title: 'shared/PbxServersListHeader',
  component: PbxServersListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServersListHeader>

const Template: ComponentStory<typeof PbxServersListHeader> = (args) => <PbxServersListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
