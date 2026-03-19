import { cn } from "@tally/ui/lib/utils"

type SpinnerProps = {
  className?: string
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <svg
      className={cn("bg-transparent text-inherit", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Static outer circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.25"
        className="text-inherit"
      />
      {/* Spinning inner element */}
      <g
        className="animate-spin text-inherit"
        style={{ transformOrigin: "50% 50%" }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="23.562"
          fill="none"
          className="text-inherit"
        />
      </g>
    </svg>
  )
}

export default Spinner
