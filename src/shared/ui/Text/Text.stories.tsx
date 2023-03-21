import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Text, TextSize, TextTheme } from './Text'
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator'
import { Theme } from 'app/providers/ThemeProvider'

export default {
    title: 'shared/Text',
    component: Text,
    argTypes: {
        backgroundColor: { control: 'color' }
    }
} as ComponentMeta<typeof Text>

const Template: ComponentStory<typeof Text> = (args) => <Text {...args} />

export const Primary = Template.bind({})
Primary.args = {
    title: 'Title text',
    text: 'Some little text'
}

export const Error = Template.bind({})
Error.args = {
    title: 'Title text',
    text: 'Some little text',
    theme: TextTheme.ERROR
}

export const OnlyTitle = Template.bind({})
OnlyTitle.args = {
    title: 'Title text'
}

export const OnlyText = Template.bind({})
OnlyText.args = {
    text: 'Some text'
}

export const PrimaryDark = Template.bind({})
PrimaryDark.args = {
    title: 'Title text',
    text: 'Some text'
}
PrimaryDark.decorators = [ThemeDecorator(Theme.DARK)]

export const OnlyTitleDark = Template.bind({})
OnlyTitleDark.args = {
    title: 'Title text',
    text: 'Some text'
}
OnlyTitleDark.decorators = [ThemeDecorator(Theme.DARK)]

export const OnlyTextDark = Template.bind({})
OnlyTextDark.args = {
    title: 'Title text',
    text: 'Some text'
}
OnlyTextDark.decorators = [ThemeDecorator(Theme.DARK)]

export const TextSizeS = Template.bind({})
TextSizeS.args = {
    title: 'Title text',
    text: 'Some text',
    size: TextSize.S
}

export const TextSizeM = Template.bind({})
TextSizeM.args = {
    title: 'Title text',
    text: 'Some text',
    size: TextSize.M
}

export const TextSizeL = Template.bind({})
TextSizeL.args = {
    title: 'Title text',
    text: 'Some text',
    size: TextSize.L
}

export const TextSizeXL = Template.bind({})
TextSizeXL.args = {
    title: 'Title text',
    text: 'Some text',
    size: TextSize.XL
}
