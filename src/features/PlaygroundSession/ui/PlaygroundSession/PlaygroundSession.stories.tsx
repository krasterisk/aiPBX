import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PlaygroundSession } from './PlaygroundSession';

export default {
    title: 'features/PlaygroundSession',
    component: PlaygroundSession,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof PlaygroundSession>;

const Template: ComponentStory<typeof PlaygroundSession> = (args) => <PlaygroundSession {...args} />;

export const Normal = Template.bind({});
Normal.args = {
   
};