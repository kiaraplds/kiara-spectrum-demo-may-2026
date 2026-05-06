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

import {CampaignBanner} from '../../src/campaignbanner/CampaignBanner';
import {pointerMap, render} from '@react-spectrum/test-utils-internal';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('CampaignBanner', function () {
  let user;

  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
  });

  const defaultProps = {
    title: 'Banner title',
    subtitle: 'Banner subtitle text',
    ctaLabel: 'Get started',
    ctaAction: jest.fn()
  };

  afterEach(() => {
    defaultProps.ctaAction.mockClear();
  });

  it('has banner role', function () {
    let {getByRole} = render(<CampaignBanner {...defaultProps} />);
    let banner = getByRole('banner');
    expect(banner).toBeVisible();
  });

  it('names the banner from the title', function () {
    let {getByRole} = render(<CampaignBanner {...defaultProps} />);
    let banner = getByRole('banner');
    expect(banner).toHaveAccessibleName('Banner title');
  });

  it('renders title, subtitle, and CTA label', function () {
    let {getByRole, getByText} = render(<CampaignBanner {...defaultProps} />);
    expect(getByRole('heading', {level: 2})).toHaveTextContent('Banner title');
    expect(getByText('Banner subtitle text')).toBeVisible();
    expect(getByRole('button', {name: 'Get started'})).toBeVisible();
  });

  it.each`
    variant
    ${'info'}
    ${'success'}
    ${'warning'}
    ${'error'}
  `('$variant variant applies modifier class', function ({variant}) {
    let {getByRole} = render(
      <CampaignBanner {...defaultProps} variant={variant} />
    );
    let banner = getByRole('banner');
    expect(banner).toHaveClass(`spectrum-CampaignBanner--${variant}`);
  });

  it('invokes ctaAction when the CTA is pressed', async function () {
    let {getByRole} = render(<CampaignBanner {...defaultProps} />);
    let button = getByRole('button', {name: 'Get started'});
    await user.click(button);
    expect(defaultProps.ctaAction).toHaveBeenCalledTimes(1);
  });
});
