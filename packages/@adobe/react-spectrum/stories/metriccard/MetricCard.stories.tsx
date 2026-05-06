/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {MetricCard, SpectrumMetricCardProps} from '../../src/metriccard/MetricCard';
import {Meta, StoryObj} from '@storybook/react';
import Data from '@spectrum-icons/workflow/Data';
import React from 'react';

type StoryArgs = SpectrumMetricCardProps;

const meta: Meta<StoryArgs> = {
  title: 'MetricCard',
  component: MetricCard,
  args: {
    label: 'Revenue',
    value: 128400,
    trend: 12.3,
    trendLabel: 'vs last week',
    variant: 'default'
  },
  argTypes: {
    icon: {
      table: {disable: true}
    }
  },
  decorators: [
    (Story) => (
      <div style={{maxWidth: 360}}>
        <Story />
      </div>
    )
  ]
};

export default meta;

export type MetricCardStory = StoryObj<StoryArgs>;

export const Default: MetricCardStory = {
  render: (args) => <MetricCard {...args} />
};

export const Highlighted: MetricCardStory = {
  args: {variant: 'highlighted', trend: 8.1},
  render: (args) => <MetricCard {...args} />
};

export const NegativeTrend: MetricCardStory = {
  args: {trend: -4.5, label: 'Churn rate', value: '2.1%', trendLabel: 'vs last month'},
  render: (args) => <MetricCard {...args} />
};

export const NeutralTrend: MetricCardStory = {
  args: {trend: 0, value: 99.2, trendLabel: 'vs benchmark'},
  render: (args) => <MetricCard {...args} />
};

export const WithIcon: MetricCardStory = {
  args: {
    icon: <Data size="S" />
  },
  render: (args) => <MetricCard {...args} />
};
