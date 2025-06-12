"use client";

import { useCurrentPath } from "@/app/hooks/useCurrentPath";

export function PageTitle() {
    return <h1 className="text-2xl font-bold capitalize dark:text-neutral-50/80">{useCurrentPath().split("/sites/")}</h1>;
}
