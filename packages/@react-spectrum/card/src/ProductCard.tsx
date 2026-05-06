/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Button, Heading, Image} from '@adobe/react-spectrum';
import React, {forwardRef} from 'react';
import styles from './productCard.css';

import {useId} from 'react-aria/useId';

export type ProductCardVariant = 'default' | 'quiet' | 'horizontal';

export interface ProductCardProps {
  /**
   * Primary product name shown as the card heading.
   */
  title: string,
  /**
   * Formatted price for display (include currency, for example `"$24.00"`).
   */
  price: string,
  /** URL for the product image. */
  imageSrc: string,
  /** Accessible description of the product image. */
  imageAlt: string,
  /**
   * Label for the add-to-cart action.
   * @default `"Add to cart"`
   */
  addToCartLabel?: string,
  /**
   * Called when the user activates **Add to cart** via pointer or keyboard
   * (`Enter` / `Space` on the button, handled by React Aria).
   */
  onAddToCart?: () => void,
  /** Disables the add-to-cart control. */
  isDisabled?: boolean,
  /**
   * Visual style aligned with Spectrum card patterns.
   * @default `'default'`
   */
  variant?: ProductCardVariant,
  /** Optional class for the root `article`. */
  UNSAFE_className?: string,
  /** Optional style for the root `article`. */
  UNSAFE_style?: React.CSSProperties,
  /** Root element id. */
  id?: string,

  /** Accessible name for the whole card when a visible title is not sufficient. */
  'aria-label'?: string,
  /** Extra description announced with the card (appended after the price id). */
  'aria-describedby'?: string,
  /** Identifies the element(s) that label the card; overrides the auto-generated title id. */
  'aria-labelledby'?: string
}

/**
 * ProductCard presents commerce-style content: imagery, title, price, and an add-to-cart action,
 * using Spectrum design tokens for spacing, color, and type.
 * The primary action is a Spectrum `Button`, which provides keyboard interaction (`Enter` and `Space`) via React Aria.
 */
export const ProductCard = forwardRef<HTMLElement, ProductCardProps>(function ProductCard(props, ref) {
  let {
    title,
    price,
    imageSrc,
    imageAlt,
    addToCartLabel = 'Add to cart',
    onAddToCart,
    isDisabled = false,
    variant = 'default',
    UNSAFE_className,
    UNSAFE_style,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedByProp,
    'aria-labelledby': ariaLabelledByProp
  } = props;

  let autoTitleId = useId();
  let priceId = useId();
  let titleId = ariaLabelledByProp ? undefined : autoTitleId;
  let ariaDescribedBy = [priceId, ariaDescribedByProp].filter(Boolean).join(' ') || undefined;

  let rootClassName = [
    styles['productCard'],
    variant === 'quiet' && styles['productCard--quiet'],
    variant === 'horizontal' && styles['productCard--horizontal'],
    UNSAFE_className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={ref}
      id={id}
      className={rootClassName}
      style={UNSAFE_style}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledByProp ?? titleId}
      aria-describedby={ariaDescribedBy}>
      <div className={styles['imageRegion']}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          objectFit="cover"
          UNSAFE_className={styles['coverImage']}
          UNSAFE_style={{width: '100%', height: '100%'}} />
      </div>
      <div className={styles['content']}>
        <Heading level={3} {...(titleId != null ? {id: titleId} : {})} UNSAFE_className={styles['title']}>
          {title}
        </Heading>
        <p id={priceId} className={styles['price']}>
          {price}
        </p>
        <div className={styles['footer']}>
          <Button variant="accent" isDisabled={isDisabled} onPress={onAddToCart}>
            {addToCartLabel}
          </Button>
        </div>
      </div>
    </article>
  );
});
