import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ToolEditPage from './ToolEditPage'

export default {
  title: 'shared/ToolEditPage',
  component: ToolEditPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolEditPage>

const Template: ComponentStory<typeof ToolEditPage> = () => <ToolEditPage />

export const Normal = Template.bind({})
Normal.args = {}
