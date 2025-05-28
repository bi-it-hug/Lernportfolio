"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as IonIcons from "react-ionicons";

export function Navigation() {
    const pathname = usePathname();

    const iconClasses = "size-3 text-neutral-50";

    const pages = [
        { href: "/home", icon: <IonIcons.Home className={iconClasses} /> },
        { href: "/settings", icon: <IonIcons.Cog className={iconClasses} /> },
    ];

    return (
        <nav>
            <ul className="flex flex-col gap-1">
                {pages.map((link) => (
                    <li key={link.href} className="flex w-fit">
                        <Link
                            href={link.href}
                            className={`${pathname === link.href ? `bg-indigo-300/10` : "bg-(--main-background-color)"} overflow-hidden border-(length:--border-width) border-(--border-color) flex justify-start items-center gap-1.5 w-32 capitalize text-sm text-neutral-50 hover:bg-neutral-800 rounded-lg`}
                        >
                            <div className={`${pathname === link.href ? "w-1.5" : "w-0"} h-full bg-indigo-300`}></div>
                            {link.icon}
                            <p className={`${pathname === link.href ? `text-indigo-300` : "text-neutral-50"} py-1`}>{link.href.replace("/", "")}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// import { IonIcon } from "@/app/components/ion-icon";
// <IonIcon Icon={link.icon} ClassName={`${pathname === link.href ? `fill-indigo-300` : "fill-neutral-50"} size-4`} />
