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

import {AriaLabelingProps, DOMProps, DOMRef, IconColorValue, StyleProps} from '@react-types/shared';
import {filterDOMProps} from 'react-aria/filterDOMProps';
import React, {CSSProperties, forwardRef} from 'react';
import {useDOMRef} from '../utils/useDOMRef';
import {useProviderProps} from '../provider/Provider';
import {useStyleProps} from '../utils/styleProps';

/** Semantic colors mapped to Spectrum design tokens. */
export type SpectrumNotificationDotColor = IconColorValue | 'neutral';

export interface SpectrumNotificationDotProps extends DOMProps, StyleProps, AriaLabelingProps {
  /**
   * The color of the dot, using Spectrum semantic color tokens.
   * @default 'informative'
   */
  color?: SpectrumNotificationDotColor,
  /**
   * The visual size of the dot (uses global dimension tokens).
   * @default 'S'
   */
  size?: 'S' | 'M' | 'L',
  /**
   * Exposes the dot to assistive technologies when it conveys meaning on its own.
   * Use `'img'` with `aria-label` / `aria-labelledby` for a named indicator (for example, unread notifications).
   * Use `'status'` when the dot represents live status text; pair with an accessible name where appropriate.
   */
  role?: 'status' | 'img'
}

const NOTIFICATION_DOT_DIMENSIONS: Record<NonNullable<SpectrumNotificationDotProps['size']>, string> = {
  S: 'var(--spectrum-global-dimension-size-75)',
  M: 'var(--spectrum-global-dimension-size-100)',
  L: 'var(--spectrum-global-dimension-size-150)'
};

function notificationDotColorToken(color: SpectrumNotificationDotColor): string {
  if (color === 'neutral') {
    return 'var(--spectrum-gray-visual-color)';
  }

  return `var(--spectrum-semantic-${color}-color-icon)`;
}

/**
 * A compact dot for notification or status indicators.
 * When the dot is decorative and duplicates information from a parent control, leave it unlabelled so it is hidden from assistive technologies by default.
 * When it carries its own meaning, provide `aria-label` or `aria-labelledby` (and optionally `role`).
 */
export const NotificationDot = forwardRef(function NotificationDot(props: SpectrumNotificationDotProps, ref: DOMRef<HTMLSpanElement>) {
  let {
    color = 'informative',
    size = 'S',
    role: roleProp,
    ...otherProps
  } = useProviderProps(props);
  let domRef = useDOMRef(ref);
  let {styleProps} = useStyleProps(otherProps);
  let {style: spectrumLayoutStyle, ...stylePropsRest} = styleProps;

  let hasAccessibleName = !!(props['aria-label'] ?? props['aria-labelledby']);
  let role = roleProp;
  if (role === undefined && hasAccessibleName) {
    role = 'img';
  }

  if (role && !hasAccessibleName && process.env.NODE_ENV !== 'production') {
    console.warn('NotificationDot: when role is set, provide aria-label or aria-labelledby so assistive technologies can describe the indicator.');
  }

  let ariaHiddenProp = props['aria-hidden'];
  let resolvedAriaHidden: boolean | undefined;
  if (ariaHiddenProp === true || ariaHiddenProp === 'true') {
    resolvedAriaHidden = true;
  } else if (ariaHiddenProp === false || ariaHiddenProp === 'false') {
    resolvedAriaHidden = false;
  } else if (!hasAccessibleName && role == null) {
    resolvedAriaHidden = true;
  } else {
    resolvedAriaHidden = undefined;
  }

  let dimension = NOTIFICATION_DOT_DIMENSIONS[size];
  let dotStyle: CSSProperties = {
    ...spectrumLayoutStyle,
    display: 'inline-block',
    flexShrink: 0,
    boxSizing: 'border-box',
    borderRadius: '50%',
    width: dimension,
    height: dimension,
    backgroundColor: notificationDotColorToken(color)
  };

  return (
    <span
      {...filterDOMProps(otherProps, {labelable: !!role})}
      {...stylePropsRest}
      role={role}
      aria-hidden={resolvedAriaHidden}
      style={dotStyle}
      ref={domRef} />
  );
});
