import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PaymentPage } from './PaymentPage'

export default {
  title: 'shared/PaymentPage',
  component: PaymentPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PaymentPage>

const Template: ComponentStory<typeof PaymentPage> = (args) => <PaymentPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}
