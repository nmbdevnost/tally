import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getSession } from "@/lib/auth-server"

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
  component: () => <Outlet />,
})
