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

import AlertMedium from '@spectrum-icons/ui/AlertMedium';
import {Button} from '../button/Button';
import {classNames} from '../utils/classNames';
import {DOMProps, DOMRef, PressEvent, StyleProps} from '@react-types/shared';
import {filterDOMProps} from 'react-aria/filterDOMProps';
import InfoMedium from '@spectrum-icons/ui/InfoMedium';
import intlMessages from '../../intl/campaignbanner/*.json';
import React from 'react';
import SuccessMedium from '@spectrum-icons/ui/SuccessMedium';
// @ts-ignore
import styles from '@adobe/spectrum-css-temp/components/campaignbanner/vars.css';
import {Heading} from '../text/Heading';
import {useDOMRef} from '../utils/useDOMRef';
import {useId} from 'react-aria/useId';
import {useLocalizedStringFormatter} from 'react-aria/useLocalizedStringFormatter';
import {useProviderProps} from '../provider/Provider';
import {useStyleProps} from '../utils/styleProps';

export interface SpectrumCampaignBannerProps extends DOMProps, StyleProps {
  /**
   * Primary heading for the banner (also used as the accessible name via `aria-labelledby`).
   */
  title: string,
  /**
   * Supporting text below the title.
   */
  subtitle: string,
  /**
   * Label for the call-to-action button.
   */
  ctaLabel: string,
  /**
   * Handler invoked when the CTA is pressed.
   */
  ctaAction: (e: PressEvent) => void,
  /**
   * Visual variant that sets border and icon colors using Spectrum semantic tokens.
   * @default 'info'
   */
  variant?: 'info' | 'success' | 'warning' | 'error'
}

const ICONS = {
  info: InfoMedium,
  success: SuccessMedium,
  warning: AlertMedium,
  error: AlertMedium
} as const;

/**
 * Campaign banners surface product launches and feature announcements with a title, subtitle, and optional CTA.
 */
export const CampaignBanner = React.forwardRef(function CampaignBanner(props: SpectrumCampaignBannerProps, ref: DOMRef<HTMLDivElement>) {
  props = useProviderProps(props);
  let {
    title: bannerTitle,
    subtitle,
    ctaLabel,
    ctaAction,
    variant = 'info',
    ...otherProps
  } = props;

  let {styleProps} = useStyleProps(otherProps);
  let domRef = useDOMRef(ref);
  let titleId = useId();
  let stringFormatter = useLocalizedStringFormatter(intlMessages, '@react-spectrum/campaignbanner');

  let Icon = ICONS[variant];
  let iconAlt = stringFormatter.format(variant);

  return (
    <div
      {...filterDOMProps(otherProps)}
      {...styleProps}
      ref={domRef}
      role="banner"
      aria-labelledby={titleId}
      className={classNames(
        styles,
        'spectrum-CampaignBanner',
        `spectrum-CampaignBanner--${variant}`,
        styleProps.className
      )}>
      <div className={classNames(styles, 'spectrum-CampaignBanner-container')}>
        <Icon UNSAFE_className={classNames(styles, 'spectrum-CampaignBanner-icon')} aria-label={iconAlt} />
        <div className={classNames(styles, 'spectrum-CampaignBanner-body')}>
          <Heading
            id={titleId}
            level={2}
            UNSAFE_className={classNames(styles, 'spectrum-CampaignBanner-title')}>
            {bannerTitle}
          </Heading>
          <p className={classNames(styles, 'spectrum-CampaignBanner-subtitle')}>
            {subtitle}
          </p>
        </div>
        <div className={classNames(styles, 'spectrum-CampaignBanner-cta')}>
          <Button variant="primary" onPress={ctaAction}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
});
