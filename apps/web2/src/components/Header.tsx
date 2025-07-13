import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
// import { ModeToggle } from '@/components/layout/theme-toggle'

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between pr-4">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs />
      </div>
      {/* <ModeToggle /> */}
    </header>
  )
}
