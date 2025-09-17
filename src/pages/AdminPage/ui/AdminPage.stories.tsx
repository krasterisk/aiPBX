import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AdminPageAsync as AdminPage } from './AdminPage.async'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { RouterDecorator } from '@/shared/config/storybook/RouterDecorator/RouterDecorator'

export default {
  title: 'pages/AdminPage',
  component: AdminPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AdminPage>

const Template: ComponentStory<typeof AdminPage> = () => <AdminPage />

export const Normal = Template.bind({})
Normal.args = {}
Normal.decorators = [StoreDecorator({}), RouterDecorator]
