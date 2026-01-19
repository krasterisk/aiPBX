import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Playground from './Playground';

export default {
    title: 'pages/Playground',
    component: Playground,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Playground>;

const Template: ComponentStory<typeof Playground> = (args) => <Playground {...args} />;

export const Normal = Template.bind({});
Normal.args = {

};