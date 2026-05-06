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

import {action} from 'storybook/actions';
import {Flex} from '@adobe/react-spectrum';
import {Meta, StoryObj} from '@storybook/react';
import {ProductCard} from '../src/ProductCard';

import React from 'react';

const sample = {
  imageSrc: 'https://i.imgur.com/Z7AzH2c.jpg',
  imageAlt: 'Sample product texture in warm orange tones',
  title: 'Studio headphones',
  price: '$189.00'
};

export default {
  title: 'ProductCard',
  component: ProductCard,
  args: {
    ...sample,
    addToCartLabel: 'Add to cart',
    onAddToCart: action('add to cart')
  },
  decorators: [
    Story => (
      <Flex justifyContent="center" width="100%">
        <div style={{width: 280}}>
          <Story />
        </div>
      </Flex>
    )
  ]
} as Meta<typeof ProductCard>;

export type ProductCardStory = StoryObj<typeof ProductCard>;

export const Default: ProductCardStory = {};

export const Quiet: ProductCardStory = {
  args: {variant: 'quiet'}
};

export const Horizontal: ProductCardStory = {
  args: {variant: 'horizontal'},
  decorators: [
    Story => (
      <Flex justifyContent="center" width="100%">
        <div style={{width: 420}}>
          <Story />
        </div>
      </Flex>
    )
  ]
};

export const Disabled: ProductCardStory = {
  args: {isDisabled: true}
};

/**
 * All visual variants together for quick review in Storybook.
 */
export const AllVariants: ProductCardStory = {
  render: args => (
    <Flex direction="column" gap="size-300" width="100%" alignItems="center">
      <div style={{width: 280}}>
        <ProductCard {...args} variant="default" title={`${sample.title} — default`} />
      </div>
      <div style={{width: 280}}>
        <ProductCard {...args} variant="quiet" title={`${sample.title} — quiet`} />
      </div>
      <div style={{width: 420}}>
        <ProductCard {...args} variant="horizontal" title={`${sample.title} — horizontal`} />
      </div>
      <div style={{width: 280}}>
        <ProductCard
          {...args}
          variant="default"
          title={`${sample.title} — disabled`}
          isDisabled />
      </div>
    </Flex>
  )
};
