import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolsPage } from './ToolsPage'

export default {
  title: 'shared/ToolsPage',
  component: ToolsPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolsPage>

const Template: ComponentStory<typeof ToolsPage> = (args) => <ToolsPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}
