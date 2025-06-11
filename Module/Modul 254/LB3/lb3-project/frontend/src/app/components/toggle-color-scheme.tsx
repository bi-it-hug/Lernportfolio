"use client";

import { useEffect, useState } from "react";
import { IonIcon } from "@/app/components/ion-icon";

export function ToggleColorScheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const dark = localStorage.getItem("dark") === "true";
        document.documentElement.classList.toggle("dark", dark);
        setIsDark(dark);
    }, []);

    function toggleScheme() {
        const newDark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", newDark);
        localStorage.setItem("dark", newDark.toString());
        setIsDark(newDark);
    }

    return (
        <button className="flex justify-center items-center size-fit p-[7px] rounded-full hover:cursor-pointer dark:hover:bg-neutral-800" onClick={toggleScheme}>
            <IonIcon Icon={isDark ? "Contrast" : "ContrastOutline"} ClassName="dark:fill-neutral-500" />
        </button>
    );
}
