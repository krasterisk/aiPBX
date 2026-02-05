import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerForm } from './PbxServerForm'

export default {
  title: 'features/PbxServerForm',
  component: PbxServerForm,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerForm>

const Template: ComponentStory<typeof PbxServerForm> = (args) => <PbxServerForm {...args} />

export const Normal = Template.bind({})
Normal.args = {}
