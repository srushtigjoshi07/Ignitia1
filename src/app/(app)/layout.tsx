import Link from "next/link";
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";

import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { UserProvider } from "@/firebase/auth/use-user";
import { FirebaseProvider } from "@/firebase";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <UserProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Skill Assessment">
                    <Link href="/skill-assessment">
                      <ClipboardList />
                      <span>Skill Assessment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Learning Path">
                    <Link href="/learning-path">
                      <BookOpenCheck />
                      <span>Learning Path</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Profile">
                    <Link href="/profile">
                      <UserCircle />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/profile">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Log Out">
                    <Link href="/login">
                      <LogOut />
                      <span>Log Out</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </FirebaseProvider>
  );
}
