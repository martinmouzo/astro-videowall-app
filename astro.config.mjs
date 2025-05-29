// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import react from '@astrojs/react';

import icon from "astro-icon";

import node from '@astrojs/node';


// https://astro.build/config
export default defineConfig({
  output: 'server',
    adapter: node({
    mode: 'standalone',
  }),
  integrations: [vue(), react(), icon(),],

});