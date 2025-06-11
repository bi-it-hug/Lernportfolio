"use client";

import { usePathname } from "next/navigation";

export function useCurrentPath() {
    return usePathname();
}
