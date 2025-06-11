"use client";

import { useRef, useEffect, useState } from "react";
import { IonIcon } from "@/app/components/ion-icon";

export function Search() {
    const elementRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setWidth(rect.width);
        }
    }, []);

    function handleClick() {
        setIsTyping(true);
    }

    function handleBlur() {
        setIsTyping(false);
    }

    return (
        <div className="flex justify-center items-center w-xs h-fit p-[0.4375rem] rounded-md dark:bg-neutral-800">
            <div
                ref={elementRef}
                style={{ transform: `translateX(${isTyping ? `calc(-100% - ${width}px + 2px)` : 0})` }}
                className={`flex items-center gap-1 capitalize text-sm dark:text-neutral-50 rounded-lg`}
            >
                <IonIcon Icon="Search" ClassName="dark:fill-neutral-500" />
                <div className={`dark:text-neutral-500 text-[0.8125rem] font-semibold leading-none relative`}>
                    <p className={`${isTyping ? "opacity-0" : ""}`}>Search</p>
                    <input onClick={handleClick} onBlur={handleBlur} type="text" placeholder="Search" className={`${isTyping ? "w-2xs" : "opacity-0"} absolute inset-0 placeholder:text-neutral-500`} />
                </div>
            </div>
        </div>
    );
}
