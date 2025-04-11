import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ToolCreatePage from './ToolCreatePage'

export default {
  title: 'shared/ToolCreatePage',
  component: ToolCreatePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolCreatePage>

const Template: ComponentStory<typeof ToolCreatePage> = () => <ToolCreatePage />

export const Normal = Template.bind({})
Normal.args = {}
