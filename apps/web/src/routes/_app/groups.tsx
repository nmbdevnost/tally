import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/groups")({
  component: GroupsPage,
})

function GroupsPage() {
  return <div>Groups</div>
}
