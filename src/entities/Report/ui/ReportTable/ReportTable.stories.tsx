import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { RebortTable } from './ReportTable'

export default {
  title: 'shared/RebortTable',
  component: RebortTable,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof RebortTable>

const Template: ComponentStory<typeof RebortTable> = (args) => <RebortTable {...args} />

export const Normal = Template.bind({})
Normal.args = {}
