import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: 'docs',
  title: 'React Template Docs',
  description:
    'Architecture and implementation guide for the React template project.',
  themeConfig: {
    nav: [
      { text: 'Getting started', link: '/getting-started/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Features', link: '/features/' },
      { text: 'AI', link: '/ai/' },
    ],
    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Overview', link: '/getting-started/' },
            { text: 'Installation', link: '/getting-started/installation' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/' },
            { text: 'Feature Slice', link: '/architecture/feature-slice' },
            {
              text: 'Layers and Data Flow',
              link: '/architecture/layers-and-data-flow',
            },
          ],
        },
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            {
              text: 'Components',
              link: '/features/components/',
            },
            {
              text: 'Auth',
              link: '/features/auth/',
            },
            {
              text: 'Forms',
              link: '/features/forms/',
            },
            {
              text: 'Tables',
              link: '/features/tables/',
            },
          ],
        },
      ],
      '/features/components/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Components', link: '/features/components/' },
            {
              text: 'Form Components',
              link: '/features/components/form-components',
            },
            {
              text: 'Data and Feedback',
              link: '/features/components/data-and-feedback-components',
            },
            { text: 'Auth', link: '/features/auth/' },
            { text: 'Forms', link: '/features/forms/' },
            { text: 'Tables', link: '/features/tables/' },
          ],
        },
      ],
      '/features/auth/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Components', link: '/features/components/' },
            { text: 'Auth', link: '/features/auth/' },
            { text: 'Auth Deep Dive', link: '/features/auth/auth-deep-dive' },
            { text: 'Forms', link: '/features/forms/' },
            { text: 'Tables', link: '/features/tables/' },
          ],
        },
      ],
      '/features/forms/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Components', link: '/features/components/' },
            { text: 'Auth', link: '/features/auth/' },
            { text: 'Forms', link: '/features/forms/' },
            { text: 'Tables', link: '/features/tables/' },
          ],
        },
      ],
      '/features/tables/': [
        {
          text: 'Features',
          items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Components', link: '/features/components/' },
            { text: 'Auth', link: '/features/auth/' },
            { text: 'Forms', link: '/features/forms/' },
            { text: 'Tables', link: '/features/tables/' },
          ],
        },
      ],
      '/ai/': [
        {
          text: 'AI',
          items: [
            { text: 'Overview', link: '/ai/' },
            { text: 'AGENTS.md', link: '/ai/agents' },
            { text: 'Skills', link: '/ai/skills' },
          ],
        },
      ],
    },
  },
});
