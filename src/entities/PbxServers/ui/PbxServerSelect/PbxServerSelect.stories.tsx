import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PbxServerSelect } from './PbxServerSelect'

export default {
    title: 'shared/PbxServerSelect',
    component: PbxServerSelect,
    argTypes: {
        backgroundColor: { control: 'color' }
    }
} as ComponentMeta<typeof PbxServerSelect>

const Template: ComponentStory<typeof PbxServerSelect> = (args) => <PbxServerSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {
    
}
