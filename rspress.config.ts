import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: 'docs',
  title: 'React Template Docs',
  description:
    'Architecture and implementation guide for the React template project.',
  themeConfig: {
    nav: [
      { text: 'Introduction', link: '/introduction' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Components', link: '/components/' },
      { text: 'Auth', link: '/auth/' },
      { text: 'Forms', link: '/forms/' },
      { text: 'Tables', link: '/tables/' },
      { text: 'AI', link: '/ai/' },
    ],
    sidebar: {
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
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            {
              text: 'Form Components',
              link: '/components/form-components',
            },
            {
              text: 'Data and Feedback',
              link: '/components/data-and-feedback-components',
            },
          ],
        },
      ],
      '/auth/': [
        {
          text: 'Auth',
          items: [{ text: 'Overview', link: '/auth/' }],
        },
      ],
      '/forms/': [
        {
          text: 'Forms',
          items: [{ text: 'Overview', link: '/forms/' }],
        },
      ],
      '/tables/': [
        {
          text: 'Tables',
          items: [{ text: 'Overview', link: '/tables/' }],
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
