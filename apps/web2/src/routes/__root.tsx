import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Layout from '@/components/layout/layout'
import TanStackQueryLayout from '@/integrations/tanstack-query/layout.tsx'
import { ThemeProvider } from '@/components/providers/theme-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Outlet />
      </Layout>

      <TanStackRouterDevtools initialIsOpen={false} />
      <TanStackQueryLayout />
    </ThemeProvider>
  ),
})
