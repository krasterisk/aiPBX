import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MediaPlayer } from './MediaPlayer'

export default {
  title: 'shared/MediaPlayer',
  component: MediaPlayer,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof MediaPlayer>

const Template: ComponentStory<typeof MediaPlayer> = (args) => <MediaPlayer {...args} />

export const Normal = Template.bind({})
Normal.args = {}
