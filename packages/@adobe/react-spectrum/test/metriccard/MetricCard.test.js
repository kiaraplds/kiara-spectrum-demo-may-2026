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

import {MetricCard} from '../../src/metriccard/MetricCard';
import {render} from '@react-spectrum/test-utils-internal';
import Data from '@spectrum-icons/workflow/Data';
import React from 'react';

describe('MetricCard', function () {
  const defaultProps = {
    label: 'Revenue',
    value: 1000,
    trend: 10,
    trendLabel: 'vs last week'
  };

  it('has region role and accessible name from label', function () {
    let {getByRole} = render(<MetricCard {...defaultProps} />);
    let region = getByRole('region', {name: 'Revenue'});
    expect(region).toBeVisible();
  });

  it('applies variant modifier classes', function () {
    let {getByRole, rerender} = render(
      <MetricCard {...defaultProps} variant="default" />
    );
    let region = getByRole('region', {name: 'Revenue'});
    expect(region).toHaveClass('spectrum-MetricCard--default');

    rerender(<MetricCard {...defaultProps} variant="highlighted" />);
    region = getByRole('region', {name: 'Revenue'});
    expect(region).toHaveClass('spectrum-MetricCard--highlighted');
  });

  it.each`
    trend | tone
    ${5}   | ${'positive'}
    ${-3}  | ${'negative'}
    ${0}   | ${'neutral'}
  `('trend $trend uses $tone tone class', function ({trend, tone}) {
    let {getByRole} = render(<MetricCard {...defaultProps} trend={trend} />);
    let region = getByRole('region', {name: 'Revenue'});
    let trendEl = region.querySelector('.spectrum-MetricCard-trend');
    expect(trendEl).toHaveClass(`spectrum-MetricCard-trend--${tone}`);
  });

  it('renders optional icon in the label row', function () {
    let {getByRole} = render(
      <MetricCard {...defaultProps} icon={<Data data-testid="metric-icon" />} />
    );
    let region = getByRole('region', {name: 'Revenue'});
    expect(region.querySelector('[data-testid="metric-icon"]')).toBeTruthy();
  });

  it('exposes value and trend context via aria-describedby', function () {
    let {getByRole} = render(<MetricCard {...defaultProps} />);
    let region = getByRole('region', {name: 'Revenue'});
    let id = region.getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    let summary = document.getElementById(id);
    expect(summary).toBeTruthy();
    expect(summary.textContent).toMatch(/1,000/);
    expect(summary.textContent).toContain('vs last week');
  });
});
