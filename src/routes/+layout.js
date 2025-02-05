import { themeConfig } from '$lib/themes'

export const load = () => {
  return {
    theme: {
      current: themeConfig.current,
      assets: {
        favicon: `/themes/${themeConfig.current}/favicon/favicon.png`,
        css: `/themes/${themeConfig.current}/css/style.css`,
        logo: `/themes/${themeConfig.current}/images/logo.png`
      }
    }
  }
}