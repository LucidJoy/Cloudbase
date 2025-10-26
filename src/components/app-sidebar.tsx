"use client";

import React, { useState } from "react";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LinkIcon,
  LogOutIcon,
  StarIcon,
  UsersIcon,
  PlusIcon,
  CheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);

  const loadSessions = async () => {
    try {
      const { data } = await authClient.multiSession.listDeviceSessions();
      const sessionsData = data || [];
      setSessions(
        sessionsData.map((s: any) => ({
          token: s.session?.token,
          user: s.user,
        }))
      );
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const switchAccount = async (sessionToken: string) => {
    try {
      await authClient.multiSession.setActive({
        sessionToken,
      });
      // Force a hard reload to ensure cookies are updated
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch account:", error);
    }
  };

  const addAccount = () => {
    window.open("/login?addAccount=true", "_blank");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/" prefetch>
              <Image
                src="/logos/logo.svg"
                alt="Cloudbase"
                width={30}
                height={30}
              />
              <span className="font-semibold text-sm">Cloudbase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuButton
                    key={item.title}
                    tooltip={item.title}
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    }
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link href={item.url} prefetch>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Upgrade to Pro"}
                className="gap-x-4 h-10 px-4"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Billing Portal"}
              className="gap-x-4 h-10 px-4"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="focus-visible:ring-0">
            <DropdownMenu onOpenChange={(open) => open && loadSessions()}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={"Switch Accounts"}
                  className="gap-x-4 h-10 px-4 focus-visible:ring-0"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Switch Accounts</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Accounts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sessions.length > 0 ? (
                  sessions.map((accountSession) => {
                    const isActive =
                      accountSession.user?.email === session?.user?.email;
                    return (
                      <DropdownMenuItem
                        key={accountSession.token}
                        onClick={() => switchAccount(accountSession.token)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {accountSession.user?.email || "Unknown User"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {accountSession.user?.name || "No name"}
                            </span>
                          </div>
                          {isActive && (
                            <CheckIcon className="h-4 w-4 text-sidebar-foreground hover:text-sidebar-accent-foreground" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <DropdownMenuItem disabled>
                    No active accounts
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={addAccount}
                  className="cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Sign out"}
              className="gap-x-4 h-10 px-4"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
