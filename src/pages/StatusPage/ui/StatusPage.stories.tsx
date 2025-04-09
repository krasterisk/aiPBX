import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import {StatusPage} from './StatusPage'


export default {
    title: 'shared/StatusPage',
    component: StatusPage,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof StatusPage>

const Template: ComponentStory<typeof StatusPage> = (args) => <StatusPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}

