import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ListBox } from './ListBox'

export default {
  title: 'shared/ListBox',
  component: ListBox,
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  decorators: [
    (Story) => <div style={{ padding: 100 }}><Story /></div>
  ]
} as ComponentMeta<typeof ListBox>

const Template: ComponentStory<typeof ListBox> = (args) => <ListBox {...args}/>

export const TopRight = Template.bind({})
TopRight.args = {
  direction: 'top-right',
  value: ['123'],
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321' },
    { value: '123', content: '321' }
  ]
}

export const TopLeft = Template.bind({})
TopLeft.args = {
  direction: 'top-left',
  value: ['123'],
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321' },
    { value: '123', content: '321' }
  ]
}

export const BottomRight = Template.bind({})
BottomRight.args = {
  direction: 'bottom-right',
  value: ['123'],
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321' },
    { value: '123', content: '321' }
  ]
}

export const BottomLeft = Template.bind({})
BottomLeft.args = {
  direction: 'bottom-left',
  value: ['123'],
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321' },
    { value: '123', content: '321' }
  ]
}

export const Disabled = Template.bind({})
Disabled.args = {
  readonly: true,
  value: ['123'],
  items: [
    { value: '123', content: '321', disabled: true },
    { value: '123', content: '321', disabled: true },
    { value: '123', content: '321', disabled: true }
  ]

}

export const DisabledOption = Template.bind({})
DisabledOption.args = {
  value: ['123'],
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321', disabled: true },
    { value: '123', content: '321' }
  ]

}

export const WhitLabel = Template.bind({})
WhitLabel.args = {
  value: ['123'],
  label: 'label',
  items: [
    { value: '123', content: '321' },
    { value: '123', content: '321', disabled: true },
    { value: '123', content: '321' }
  ]

}
