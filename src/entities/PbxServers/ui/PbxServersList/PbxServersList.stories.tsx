import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServersList } from './PbxServersList'

export default {
  title: 'shared/PbxServersList',
  component: PbxServersList,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServersList>

const Template: ComponentStory<typeof PbxServersList> = (args) => <PbxServersList {...args} />

export const Normal = Template.bind({})
Normal.args = {}
