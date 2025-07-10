/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import Layout from "@/components/layout/layout";
import { ThemeProvider, useTheme } from "@/components/providers/theme-provider";
import { getThemeServerFn } from "@/lib/theme";
import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Net Worth Tracker",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  loader: () => getThemeServerFn(),
});

function RootComponent() {
  const data = Route.useLoaderData();

  return (
    <ThemeProvider theme={data}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme();

  return (
    <html className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Layout>{children}</Layout>
        <Scripts />
      </body>
    </html>
  );
}
