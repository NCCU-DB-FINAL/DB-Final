export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "租屋網徵名字",
  description: "房屋出租平台",
  navItems: [
    {
      label: "我的收藏",
      href: "/like",
    },
    {
      label: "我的出租",
      href: "/post",
    },
  ],
  navMenuItems: [
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/NCCU-DB-FINAL/DB-Final",
  },
};
