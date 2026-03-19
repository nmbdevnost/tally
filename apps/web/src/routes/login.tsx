import Spinner from "@/components/spinner"
import { authClient, signIn } from "@/lib/auth-client"
import { Button } from "@tally/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tally/ui/components/card"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Tally5 } from "lucide-react"
import { useTransition } from "react"

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (session.data) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const [isPending, startTransition] = useTransition()

  async function handleGoogleSignIn() {
    startTransition(async () => {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    })
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* ── Left panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-14 lg:flex">
        {/* Geometric accents */}
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-primary-foreground/10" />
        <div className="absolute bottom-16 -left-16 size-60 rounded-full bg-primary-foreground/20" />
        <div className="absolute right-10 bottom-52 size-24 rotate-12 rounded-xl bg-primary-foreground/15" />

        {/* Logo */}
        <div className="z-10 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground">
            <Tally5 />
          </div>
          <span className="text-lg font-semibold text-primary-foreground">
            Tally
          </span>
        </div>

        {/* Tagline */}
        <div className="z-10 flex flex-col gap-4">
          <h1 className="text-4xl leading-tight font-bold text-primary-foreground">
            Every expense
            <br />
            accounted for,
            <br />
            <span className="text-primary-foreground/70">split fairly.</span>
          </h1>
          <p className="max-w-xs text-sm text-primary-foreground/70">
            Track shared expenses and settle debts with friends — simply and
            transparently.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-16">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Tally5 />
          </div>
          <span className="text-lg font-semibold">Tally</span>
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isPending}
            >
              {isPending && <Spinner />}
              <GoogleIcon />
              Continue with Google
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our terms and privacy policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
      />
      <path
        fill="#34A853"
        d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
      />
      <path
        fill="#FBBC05"
        d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
      />
      <path
        fill="#EA4335"
        d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
      />
    </svg>
  )
}
