import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PbxServerCreatePage from './PbxServerCreatePage'

export default {
  title: 'shared/PbxServerCreatePage',
  component: PbxServerCreatePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PbxServerCreatePage>

const Template: ComponentStory<typeof PbxServerCreatePage> = (args) => <PbxServerCreatePage />

export const Normal = Template.bind({})
Normal.args = {}
