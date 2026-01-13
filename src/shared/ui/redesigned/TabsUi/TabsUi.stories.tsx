import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TabsUi } from './TabsUi'
import { action } from '@storybook/addon-actions'

export default {
  title: 'shared/Tabs',
  component: TabsUi,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TabsUi>

const Template: ComponentStory<typeof TabsUi> = (args) => <TabsUi {...args} />

export const Normal = Template.bind({})
Normal.args = {
  tabs: [
    {
      value: 'tab1',
      content: 'tab1'
    },
    {
      value: 'tab2',
      content: 'tab2'
    },
    {
      value: 'tab3',
      content: 'tab3'
    }
  ],
  value: 'tab2',
  onTabClick: action('onTabClick')
}
