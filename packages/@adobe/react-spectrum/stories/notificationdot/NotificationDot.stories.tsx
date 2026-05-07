/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Flex} from '../../src/layout/Flex';
import {Meta, StoryObj} from '@storybook/react';
import {NotificationDot} from '../../src/notificationdot/NotificationDot';
import React from 'react';
import {Text} from '../../src/text/Text';

type NotificationDotStory = StoryObj<typeof NotificationDot>;

export default {
  title: 'NotificationDot',
  component: NotificationDot,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: ['positive', 'negative', 'notice', 'informative', 'neutral']
      }
    },
    size: {
      control: {
        type: 'select',
        options: ['S', 'M', 'L']
      }
    },
    role: {
      control: {
        type: 'select',
        options: [undefined, 'img', 'status']
      }
    }
  }
} as Meta<typeof NotificationDot>;

export const Default: NotificationDotStory = {
  name: 'Default',
  render: (args) => (
    <Flex gap="size-100" alignItems="center">
      <Text>Message</Text>
      <NotificationDot {...args} />
    </Flex>
  ),
  args: {
    color: 'negative',
    size: 'S'
  }
};

export const Colors: NotificationDotStory = {
  name: 'Semantic colors',
  render: () => (
    <Flex gap="size-200" alignItems="center">
      {(['positive', 'negative', 'notice', 'informative', 'neutral'] as const).map((c) => (
        <Flex key={c} gap="size-75" alignItems="center">
          <NotificationDot color={c} />
          <Text>{c}</Text>
        </Flex>
      ))}
    </Flex>
  )
};

export const Sizes: NotificationDotStory = {
  name: 'Sizes',
  render: () => (
    <Flex gap="size-150" alignItems="center">
      {(['S', 'M', 'L'] as const).map((s) => (
        <Flex key={s} gap="size-75" alignItems="center">
          <NotificationDot size={s} color="informative" />
          <Text>{s}</Text>
        </Flex>
      ))}
    </Flex>
  )
};

export const WithAccessibleName: NotificationDotStory = {
  name: 'With accessible name',
  render: () => (
    <Flex gap="size-100" alignItems="center">
      <Text>Alerts</Text>
      <NotificationDot color="negative" aria-label="Unread notifications" />
    </Flex>
  )
};
