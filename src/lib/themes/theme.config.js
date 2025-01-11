export const themeConfig = {
    current: import.meta.env.VITE_THEME_NAME || 'default',
    available: {
      default: {
        name: 'Default Theme',
        description: 'Original design'
      },
      design1: {
        name: 'Alternative Design',
        description: 'Alternative theme'
      },
      vestfold: {
        name: 'Vestfold Theme',
        description: 'Vestfold fylkeskommune design'
      }
    }
  }

export const getThemeAsset = (path) => `/themes/${themeConfig.current}/${path}`