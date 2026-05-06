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

import {action} from 'storybook/actions';
import {CampaignBanner, SpectrumCampaignBannerProps} from '../../src/campaignbanner/CampaignBanner';
import {Meta, StoryObj} from '@storybook/react';
import React from 'react';

type StoryArgs = SpectrumCampaignBannerProps;

const meta: Meta<StoryArgs> = {
  title: 'CampaignBanner',
  component: CampaignBanner,
  args: {
    title: 'Adobe Creative Cloud',
    subtitle: 'New generative features are available in Photoshop and Illustrator.',
    ctaLabel: 'Learn more',
    ctaAction: action('ctaAction'),
    variant: 'info'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error']
    },
    title: {
      control: 'text'
    },
    subtitle: {
      control: 'text'
    },
    ctaLabel: {
      control: 'text'
    },
    ctaAction: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

export type CampaignBannerStory = StoryObj<StoryArgs>;

export const Default: CampaignBannerStory = {
  render: (args) => <CampaignBanner {...args} />
};

export const Info: CampaignBannerStory = {
  args: {variant: 'info'},
  render: (args) => <CampaignBanner {...args} />
};

export const Success: CampaignBannerStory = {
  args: {variant: 'success'},
  render: (args) => <CampaignBanner {...args} />
};

export const Warning: CampaignBannerStory = {
  args: {variant: 'warning'},
  render: (args) => <CampaignBanner {...args} />
};

export const ErrorStory: CampaignBannerStory = {
  name: 'Error',
  args: {variant: 'error'},
  render: (args) => <CampaignBanner {...args} />
};
