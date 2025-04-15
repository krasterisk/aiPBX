import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ToolAddParameterModal from './ToolAddParameterModal'

export default {
  title: 'shared/ToolAddParameterModal',
  component: ToolAddParameterModal,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolAddParameterModal>

const Template: ComponentStory<typeof ToolAddParameterModal> = (args) => <ToolAddParameterModal {...args} />

export const Normal = Template.bind({})
Normal.args = {}
