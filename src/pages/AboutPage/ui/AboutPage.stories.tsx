import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AboutPageAsync as AboutPage } from './AboutPage.async'

export default {
  title: 'pages/AdminPage',
  component: AboutPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AboutPage>

const Template: ComponentStory<typeof AboutPage> = () => <AboutPage />

export const Normal = Template.bind({})
Normal.args = {}
