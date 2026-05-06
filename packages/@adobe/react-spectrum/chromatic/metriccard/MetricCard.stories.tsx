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

import {Meta, StoryObj} from '@storybook/react';
import Data from '@spectrum-icons/workflow/Data';
import React from 'react';
import {MetricCard, SpectrumMetricCardProps} from '../../src/metriccard/MetricCard';

const meta: Meta<SpectrumMetricCardProps> = {
  title: 'MetricCard',
  component: MetricCard
};

export default meta;

export type MetricCardStory = StoryObj<SpectrumMetricCardProps>;

const baseArgs: SpectrumMetricCardProps = {
  label: 'Revenue',
  value: 128400,
  trend: 12.3,
  trendLabel: 'vs last week',
  variant: 'default'
};

export const Default: MetricCardStory = {
  args: {...baseArgs}
};

export const Highlighted: MetricCardStory = {
  args: {...baseArgs, variant: 'highlighted', trend: 8.1}
};

export const NegativeTrend: MetricCardStory = {
  args: {
    ...baseArgs,
    label: 'Churn rate',
    value: '2.1%',
    trend: -4.5,
    trendLabel: 'vs last month'
  }
};

export const NeutralTrend: MetricCardStory = {
  args: {...baseArgs, trend: 0, value: 99.2, trendLabel: 'vs benchmark'}
};

export const WithIcon: MetricCardStory = {
  args: {...baseArgs, icon: <Data size="S" />}
};
