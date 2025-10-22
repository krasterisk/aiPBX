import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PbxServerEditPage from './PbxServerEditPage'

export default {
  title: 'shared/PbxServerEditPage',
  component: PbxServerEditPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerEditPage>

const Template: ComponentStory<typeof PbxServerEditPage> = (args) => <PbxServerEditPage />

export const Normal = Template.bind({})
Normal.args = {}
