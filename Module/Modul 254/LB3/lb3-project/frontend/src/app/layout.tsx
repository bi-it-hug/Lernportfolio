import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToggleColorScheme } from "@/app/components/toggle-color-scheme";
import { PageTitle } from "@/app/components/page-title";
import { Search } from "@/app/components/search";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans();

export const metadata: Metadata = {
    title: "Task-Liste",
    description: "LB3 Task-Liste",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de" className="dark">
            <body className={`${plusJakartaSans.className} antialiased w-screen h-screen flex flex-col dark:dark:bg-neutral-950`}>
                <main className="w-full h-full flex flex-col justify-start items-start p-3 lg:p-10 gap-8 dark:bg-neutral-950">
                    <PageTitle />
                    {children}
                </main>
                <footer className="w-full h-fit flex justify-center items-center p-3 gap-3 border-b-(length:--border-width) dark:border-(--border-color) dark:bg-neutral-900/50">
                    <Search />
                    <ToggleColorScheme />
                </footer>
            </body>
        </html>
    );
}

// dark:bg-[repeating-linear-gradient(45deg,_var(--border-color),_var(--border-color)_var(--border-width),_transparent_var(--border-width),_transparent_10px)]
