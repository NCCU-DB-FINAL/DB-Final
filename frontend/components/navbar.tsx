import {
  Link,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  link as linkStyles,
  button as buttonStyles,
  Button,
  User,
} from "@nextui-org/react";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { useAuth } from "./hooks/useAuth";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const pathname = usePathname();

  const { user, isLoggedIn, logout, getUserType } = useAuth();

  // Based on user type, show different nav items
  // Tenant can see /likes
  // Landlord can see /posts
  const dynamicNavItems = siteConfig.navItems.filter(
    (item) =>
      (item.href === "/like" && user?.type == "tenant") ||
      (item.href === "/post" && user?.type == "landlord"),
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {dynamicNavItems.map((item) => (
            <NavbarItem key={item.href} isActive={item.href === pathname}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isLoggedIn() ? (
          <>
            <NavbarItem className="lg:flex gap-3">
              <User description={getUserType()} name={user?.name} />
            </NavbarItem>
            <NavbarItem className="lg:flex gap-3">
              <Button variant="ghost" onClick={logout}>
                登出
              </Button>
            </NavbarItem>
            <NavbarItem className="lg:flex gap-3">
              {user?.type == "landlord" && (
                <NextLink
                  className={buttonStyles({
                    color: "primary",
                    variant: "solid",
                  })}
                  href="/publish"
                >
                  刊登
                </NextLink>
              )}
            </NavbarItem>
          </>
        ) : (
          <NavbarItem className="lg:flex gap-3">
            <NextLink
              className={buttonStyles({
                color: "primary",
                variant: "solid",
              })}
              href="/login"
            >
              登入
            </NextLink>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {dynamicNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
