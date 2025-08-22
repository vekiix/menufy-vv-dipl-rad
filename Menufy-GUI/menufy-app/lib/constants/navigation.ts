// Navigation layout constants
export const NAVIGATION_CONSTANTS = {
  SIDEBAR: {
    WIDTH: "240px",
    WIDTH_COLLAPSED: "65px",
  },
  MOBILE: {
    MIN_HEIGHT: "48px",
    MIN_WIDTH: "48px",
  },
  SKELETON: {
    ITEMS_COUNT: 4,
  }
} as const

// CSS custom properties for navigation
export const NAVIGATION_CSS_VARS = {
  "--sidebar-width": NAVIGATION_CONSTANTS.SIDEBAR.WIDTH,
  "--sidebar-width-icon": NAVIGATION_CONSTANTS.SIDEBAR.WIDTH_COLLAPSED,
} as React.CSSProperties
