import { cn } from "../../lib/utils"

function Skeleton({
    className,
    ...props
}) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-zinc-800/50", className)}
            {...props}
        />
    )
}

// Pre-built skeleton components for common use cases
function SkeletonCard({ className }) {
    return (
        <div className={cn("rounded-lg border border-zinc-800 bg-zinc-900/50 p-6", className)}>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <div className="space-y-3 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
        </div>
    )
}

function SkeletonTableRow({ columns = 5 }) {
    return (
        <div className="flex items-center space-x-4 py-4 border-b border-zinc-800">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    )
}

function SkeletonList({ items = 5, className }) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function SkeletonTechnicianCard() {
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
    )
}

function SkeletonBookingCard() {
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
            </div>
        </div>
    )
}

function SkeletonStatsCard() {
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-20 mt-4" />
        </div>
    )
}

function SkeletonDashboard() {
    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <SkeletonBookingCard />
                    <SkeletonBookingCard />
                    <SkeletonBookingCard />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <SkeletonList items={4} />
                </div>
            </div>
        </div>
    )
}

function SkeletonProfile() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-zinc-800 pb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}

export {
    Skeleton,
    SkeletonCard,
    SkeletonTableRow,
    SkeletonList,
    SkeletonTechnicianCard,
    SkeletonBookingCard,
    SkeletonStatsCard,
    SkeletonDashboard,
    SkeletonProfile
}
