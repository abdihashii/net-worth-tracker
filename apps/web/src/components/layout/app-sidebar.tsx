import {
  FileDown,
  Home,
  PlusCircle,
  Settings,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Net Worth",
    url: "/net-worth",
    icon: Wallet,
  },
  {
    title: "Assets",
    url: "/assets",
    icon: TrendingUp,
  },
  {
    title: "Liabilities",
    url: "/liabilities",
    icon: TrendingDown,
  },
  {
    title: "Add Account",
    url: "/accounts/add",
    icon: PlusCircle,
  },
  {
    title: "Export Data",
    url: "/export",
    icon: FileDown,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Net Worth Tracker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
