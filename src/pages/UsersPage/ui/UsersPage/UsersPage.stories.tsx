import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import UsersPage from "@/pages/UsersPage/ui/UsersPage/UsersPage";

export default {
    title: 'shared/UsersPage',
    component: UsersPage,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof UsersPage>

const Template: ComponentStory<typeof UsersPage> = (args) => <UsersPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}

