"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IonIcon } from "@/app/components/ion-icon";
// import { IBM_Plex_Mono } from "next/font/google";

// const plexMono = IBM_Plex_Mono({
//     weight: "400",
//     variable: "--font-plex-mono",
// });

export function Navigation() {
    const pathname = usePathname();

    const pages = [
        { href: "/home", icon: "Home" },
        { href: "/settings", icon: "Cog" },
    ];

    return (
        <nav>
            <ul className="flex flex-col gap-1">
                {pages.map((pages) => (
                    <li key={pages.href} className="flex w-fit">
                        <Link
                            href={pages.href}
                            className={`${pathname === pages.href ? `bg-[hsl(var(--theme-color))] hover:bg-indigo-300/10` : "hover:bg-neutral-800"} overflow-hidden flex justify-start items-center gap-1.5 w-32 capitalize text-sm text-neutral-50 rounded-md`}
                        >
                            <IonIcon Icon={pages.icon} ClassName={`${pathname === pages.href ? `fill-indigo-300` : "fill-neutral-50"} size-(--icon-size)`} />
                            <p className={`${pathname === pages.href ? `text-indigo-300` : "text-neutral-50"} py-1`}>{pages.href.replace("/", "")}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
