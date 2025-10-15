import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PbxServersPage from './PbxServersPage'

export default {
  title: 'pages/PbxServersPage',
  component: PbxServersPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServersPage>

const Template: ComponentStory<typeof PbxServersPage> = (args) => <PbxServersPage />

export const Normal = Template.bind({})
Normal.args = {}
