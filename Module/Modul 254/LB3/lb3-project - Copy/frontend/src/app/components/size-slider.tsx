"use client";

import { useState } from "react";

export function SizeSlider() {
    const [inputValue, setInputValue] = useState("");

    const config = {
        min: 0,
        max: 2,
    };

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setInputValue(value);
        document.documentElement.style.setProperty("--border-width", `${value}px`);
    }

    return <input type="range" min={config.min} max={config.max} defaultValue={config.min} onChange={(e) => handleInput(e)} className="appearance-none w-[4rem] h-1 bg-neutral-700 rounded-full" />;
}
