import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SettingsPageAsync as SettingsPage } from './SettingsPage.async'

export default {
  title: 'pages/SettingsPage',
  component: SettingsPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof SettingsPage>

const Template: ComponentStory<typeof SettingsPage> = (args) => <SettingsPage {...args} />

export const Normal = Template.bind({})
Normal.args = {

}
