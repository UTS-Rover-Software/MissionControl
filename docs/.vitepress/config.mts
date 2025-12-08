import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mission Control",
  description: "Mission Control Docs for Uts Rover Team",
  head: [
    ['link', { rel: 'stylesheet', href: '/style.css' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'General', link: '/general/' },
      { text: 'Widgets', link: '/widgets/' },
      { text: 'Frontend', link: '/frontend/' },
      { text: 'Backend', link: '/backend/' },
      { text: 'Contributing', link: '/contributing' }
    ],

    sidebar: [
      {
        text: 'General',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/general/' },
          { text: 'Setup', link: '/general/setup' },
          { text: 'Manual', link: '/general/manual' }
        ]
      },
      {
        text: 'Widgets',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/widgets/' },
          { text: 'Camera Feed', link: '/widgets/camera-feed' },
          { text: 'Science Widget', link: '/widgets/science-widget' },
          { text: 'Bounding Box for Widgets', link: '/widgets/bounding-box-for-widgets' },
          { text: 'Pointcloud', link: '/widgets/pointcloud' },
          { text: 'Nav2 Target Queue', link: '/widgets/nav2-target-queue' },
          { text: 'RVIZ', link: '/widgets/rviz' },
          { text: '2D Aerial Map SLAM', link: '/widgets/2d-aerial-map-slam' },
          { text: 'VESC Info Readonly', link: '/widgets/vesc-info-readonly' },
          { text: 'Machine Usage Readonly', link: '/widgets/machine-usage-readonly' },
          { text: 'Rosout Console', link: '/widgets/rosout-console' }
        ]
      },
      {
        text: 'Frontend',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/frontend/' },
          { text: 'Components', link: '/frontend/components' },
          { text: 'Styling', link: '/frontend/styling' },
          { text: 'Tilling', link: '/frontend/tilling' }
        ]
      },
      {
        text: 'Backend',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/backend/' },
          { text: 'Routers', link: '/backend/routers' },
          { text: 'Services', link: '/backend/services' },
          { text: 'Database', link: '/backend/database' },
          { text: 'CLI', link: '/backend/cli' }
        ]
      },
      {
        text: 'Contributing',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/contributing/' },
          { text: 'Development Workflow', link: '/contributing/development-workflow' },
          { text: 'Pull Requests', link: '/contributing/pull-requests' },
          { text: 'Code Style', link: '/contributing/code-style' },
          { text: 'Testing', link: '/contributing/testing' },
          { text: 'Widgets', link: '/contributing/widgets' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
