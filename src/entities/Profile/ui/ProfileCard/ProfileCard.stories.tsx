import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ProfileCard } from './ProfileCard'
import { Country } from '@/entities/Country'
import { Currency } from '@/entities/Currency'
import { NewDesignDecorator } from '@/shared/config/storybook/NewDesignDecorator/NewDesignDecorator'

export default {
  title: 'entities/ProfileCard',
  component: ProfileCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ProfileCard>

const Template: ComponentStory<typeof ProfileCard> = (args) => <ProfileCard {...args} />

const primaryArgs = {
  data: {
    firstname: 'First',
    lastname: 'Last',
    age: 19,
    username: 'Username',
    email: 'mail@email.com',
    country: Country.Russia,
    currency: Currency.RUB,
    avatar: 'https://spbx.krasterisk.ru/avatar.jpg'
  }
}

export const Primary = Template.bind({})
Primary.args = primaryArgs

export const PrimaryRedesigned = Template.bind({})
PrimaryRedesigned.args = primaryArgs
PrimaryRedesigned.decorators = [
  NewDesignDecorator
]

export const Error = Template.bind({})
Error.args = {
  error: 'error'
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true
}

export const Readonly = Template.bind({})
Readonly.args = {
  data: {
    firstname: 'First',
    lastname: 'Last',
    age: 20,
    username: 'Username',
    email: 'mail@email.com',
    country: Country.Russia,
    currency: Currency.RUB,
    avatar: 'https://spbx.krasterisk.ru/avatar.jpg'
  },
  readonly: true
}
