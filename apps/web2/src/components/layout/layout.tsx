import { QueryErrorBoundary } from '@/components/error-boundary'
import Header from '@/components/Header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorBoundary>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 pt-0 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryErrorBoundary>
  )
}
