import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { CurrencySelect } from './CurrencySelect'

export default {
  title: 'entities/User/CurrencySelect',
  component: CurrencySelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof CurrencySelect>

const Template: ComponentStory<typeof CurrencySelect> = (args) => <CurrencySelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
