import Spinner from "@/components/spinner"
import { signOut, useSession } from "@/lib/auth-client"
import { getSession } from "@/lib/auth-server"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@tally/ui/components/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tally/ui/components/avatar"
import { Separator } from "@tally/ui/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@tally/ui/components/sidebar"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router"
import {
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  Tally5,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import { useTransition } from "react"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      })
    }
    return { session }
  },
  component: AppLayout,
})

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
  { title: "Groups", url: "/groups", icon: UsersIcon },
  { title: "Budgets", url: "/budgets", icon: WalletIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
]

function AppLayout() {
  const { data: session } = useSession()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  async function handleSignOut() {
    startTransition(async () => {
      await signOut()
    })
    router.navigate({ to: "/login" })
  }

  const user = session?.user
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link to="/" />}>
                {/* Logo */}
                <div className="z-10 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Tally5 />
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    Tally
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={
                        <Link
                          to={item.url}
                          activeProps={{ "data-active": true }}
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Account">
                <Avatar size="sm">
                  <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <SidebarMenuButton
                      tooltip="Sign out"
                      className="hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20 active:text-destructive"
                    />
                  }
                >
                  <LogOutIcon />
                  <span>Sign out</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out of Tally?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      disabled={isPending}
                      variant="destructive"
                    >
                      {isPending && <Spinner />}
                      Sign out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
          {/* Logo */}
          <div className="z-10 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Tally5 />
            </div>
            <span className="text-lg font-semibold text-primary">Tally</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pb-20 md:pb-4">
          <Outlet />
        </main>
      </SidebarInset>

      {/* Bottom navigation for mobile */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
            activeProps={{
              className:
                "flex flex-col items-center gap-1 px-3 py-2 text-primary transition-colors",
            }}
          >
            <item.icon className="size-5" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </nav>
    </SidebarProvider>
  )
}
