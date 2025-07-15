import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PeriodExtendedFilters } from './PeriodExtendedFilter'

export default {
  title: 'shared/PeriodExtendedFilter',
  component: PeriodExtendedFilters,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PeriodExtendedFilters>

const Template: ComponentStory<typeof PeriodExtendedFilters> = (args) => <PeriodExtendedFilters {...args} />

export const Normal = Template.bind({})
Normal.args = {}
