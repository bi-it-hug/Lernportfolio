import { ReactNode } from "react";

export function Main({ children }: { children?: ReactNode }) {
    return <main className="w-full h-full flex flex-col justify-start items-start p-10">{children}</main>;
}
