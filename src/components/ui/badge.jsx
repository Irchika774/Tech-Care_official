import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-white text-black hover:bg-gray-100",
                secondary:
                    "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
                destructive:
                    "border-transparent bg-red-600/20 text-red-400 hover:bg-red-600/30",
                outline: "border-zinc-600 text-zinc-300 bg-transparent",
                success:
                    "border-transparent bg-green-600/20 text-green-400",
                warning:
                    "border-transparent bg-yellow-600/20 text-yellow-400",
                info:
                    "border-transparent bg-blue-600/20 text-blue-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
