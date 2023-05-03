import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import AdminPage from './AdminPage'
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator'
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { Theme } from '@/app/providers/ThemeProvider'

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
Normal.decorators = [StoreDecorator({})]

export const Dark = Template.bind({})
Dark.args = {}
Dark.decorators = [
    StoreDecorator({}),
    ThemeDecorator(Theme.DARK)
]
