import { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
});

export function Code({ children }: { children?: ReactNode }) {
    return <code className={`${jetBrainsMono.className} text-sm dark:text-neutral-50`}>{children}</code>;
}
