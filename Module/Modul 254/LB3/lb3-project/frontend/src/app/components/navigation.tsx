"use client";

import Link from "next/link";
import { IonIcon } from "@/app/components/ion-icon";
import { useCurrentPath } from "@/app/hooks/useCurrentPath";

export function Navigation() {
    const pathname = useCurrentPath();
    const base = "/sites/";
    const pages = [
        { href: `${base}tasks`, icon: "Checkbox" },
        { href: `${base}placeholder`, icon: "LogoIonic" },
        { href: `${base}settings`, icon: "Settings" },
    ];

    return (
        <nav className="size-fit">
            <ul className="flex flex-col gap-0.5">
                {pages.map((pages) => (
                    <li key={pages.href} className="flex size-fit">
                        <Link
                            href={pages.href}
                            className={`${pathname === pages.href ? `dark:bg-[hsla(var(--theme-color),_0.1)] dark:hover:bg-[hsla(var(--theme-color),_0.1)]` : "dark:hover:bg-neutral-800/75"} flex justify-start items-center p-1.75 gap-1.75 w-46 capitalize text-sm dark:text-neutral-50 rounded-lg`}
                        >
                            <IonIcon Icon={pages.icon} ClassName={`${pathname === pages.href ? `dark:fill-[hsl(var(--theme-color))]` : "dark:fill-neutral-500"}`} />
                            <p className={`${pathname === pages.href ? `dark:text-[hsl(var(--theme-color))]` : "dark:text-neutral-500"} text-[0.8125rem] font-semibold leading-none`}>
                                {pages.href.replace(base, "")}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
