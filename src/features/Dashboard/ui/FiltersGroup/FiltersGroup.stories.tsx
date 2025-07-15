import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FiltersGroup } from './FiltersGroup'

export default {
  title: 'shared/CaskFiltersGroup',
  component: FiltersGroup,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof FiltersGroup>

const Template: ComponentStory<typeof FiltersGroup> = (args) => <FiltersGroup {...args} />

export const Normal = Template.bind({})
Normal.args = {}
