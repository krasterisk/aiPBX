import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Textarea } from './Textarea'

export default {
    title: 'shared/TextArea',
    component: Textarea,
    argTypes: {
        backgroundColor: { control: 'color' }
    }
} as ComponentMeta<typeof Textarea>

const Template: ComponentStory<typeof Textarea> = () => <Textarea />

export const Normal = Template.bind({})
Normal.args = {}
