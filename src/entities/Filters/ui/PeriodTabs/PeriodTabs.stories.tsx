import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PeriodTabs } from './PeriodTabs'

export default {
  title: 'shared/PeriodTabs',
  component: PeriodTabs,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PeriodTabs>

const Template: ComponentStory<typeof PeriodTabs> = (args) => <PeriodTabs {...args} />

export const Normal = Template.bind({})
Normal.args = {}
