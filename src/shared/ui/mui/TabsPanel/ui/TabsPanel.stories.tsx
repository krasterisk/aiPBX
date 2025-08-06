import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TabsPanel } from './TabsPanel'

export default {
  title: 'shared/TabsPanel',
  component: TabsPanel,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TabsPanel>

const Template: ComponentStory<typeof TabsPanel> = (args) => <TabsPanel {...args} />

export const Normal = Template.bind({})
Normal.args = {}
