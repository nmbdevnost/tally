import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/budgets")({
  component: BudgetsPage,
})

function BudgetsPage() {
  return <div>Budgets</div>
}
