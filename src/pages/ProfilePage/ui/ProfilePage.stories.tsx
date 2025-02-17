import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ProfilePage from './ProfilePage'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { Country } from '../../../entities/Country'
import { Currency } from '../../../entities/Currency'
import { Theme } from '@/shared/const/theme'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'

export default {
  title: 'pages/ProfilePage',
  component: ProfilePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ProfilePage>

const Template: ComponentStory<typeof ProfilePage> = () => <ProfilePage/>

export const Normal = Template.bind({})
Normal.args = {}
Normal.decorators = [
  RouterDecorator,
  StoreDecorator({
    profileForm: {
      form: {
        firstname: 'First',
        lastname: 'Last',
        age: 20,
        username: 'Username',
        email: 'mail@email.com',
        country: Country.Russia,
        currency: Currency.RUB
      }
    }
  })]

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [
  RouterDecorator,
  ThemeDecorator(Theme.DARK),
  StoreDecorator({
    profileForm: {
      form: {
        firstname: 'First',
        lastname: 'Last',
        age: 20,
        username: 'Username',
        email: 'mail@email.com',
        country: Country.Russia,
        currency: Currency.RUB
      }
    }
  })]

export const Readonly = Template.bind({})
Readonly.args = {}
Readonly.decorators = [
  RouterDecorator,
  StoreDecorator({
    profileForm: {
      form: {
        firstname: 'First',
        lastname: 'Last',
        age: 20,
        username: 'Username',
        email: 'mail@email.com',
        country: Country.Russia,
        currency: Currency.RUB
      },
      readonly: true
    }
  })]

// export const PageIsLoading = Template.bind({})
// PageIsLoading.args = {}
// PageIsLoading.decorators = [StoreDecorator({
//     profileForm: {
//         data: {
//             firstname: 'Ivan',
//             lastname: 'Ivanov'
//         },
//         isLoading: true
//     }
// })]
//
// export const PageReadonly = Template.bind({})
// PageReadonly.args = {}
// PageReadonly.decorators = [StoreDecorator({
//     profileForm: {
//         data: {
//             firstname: 'Ivan',
//             lastname: 'Ivanov'
//         },
//         readonly: true
//     }
// })]
