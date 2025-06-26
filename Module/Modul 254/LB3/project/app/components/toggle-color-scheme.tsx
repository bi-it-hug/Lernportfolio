"use client";

import { useEffect, useState } from "react";
import { Eclipse } from "lucide-react";

export function ToggleColorScheme() {
    const [, setIsDark] = useState(false);

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
        <button className="flex justify-center items-center size-fit p-1.25 rounded-full hover:cursor-pointer dark:hover:bg-neutral-50/10" onClick={toggleScheme}>
            <Eclipse className="icon dark:text-neutral-500" />
        </button>
    );
}
