import { ReactNode } from "react";
import { IonIcon } from "@/app/components/ion-icon";

export function Card({ children }: { children?: ReactNode }) {
    return (
        <div className="flex flex-col w-fit h-fit p-6 gap-6 justify-start items-start relative text-neutral-50 max-w-fit max-h-fit overflow-hidden bg-(--main-background-color) border-(--border-color) border-(length:--border-width) rounded-xl">
            {children}
        </div>
    );
}

export function CardHeader({ children }: { children?: ReactNode }) {
    return <div className="flex flex-col w-full h-fit gap-1.5">{children}</div>;
}

export function CardTitle({ children }: { children?: ReactNode }) {
    return <h1 className="text-base font-semibold leading-none">{children || "Card Title"}</h1>;
}

export function CardDescription({ children }: { children?: ReactNode }) {
    return <p className="text-sm font-medium text-neutral-500">{children || "Card Description"}</p>;
}

export function CardContent({ children }: { children?: ReactNode }) {
    return <div className="flex w-full h-fit justify-center items-center">{children || <NoContent />}</div>;
}

export function CardFooter({ children }: { children?: ReactNode }) {
    return <p className="text-sm font-medium text-neutral-500">{children || "Card Footer"}</p>;
}

export function NoContent() {
    return (
        <div className="flex justify-center items-center px-3 py-1.5 gap-1 rounded-md border-(length:--border-width) border-red-400/20 bg-red-400/10">
            <IonIcon Icon="Warning" ClassName="size-4 fill-red-400"></IonIcon>
            <p className="text-sm text-red-400">No content provided</p>
        </div>
    );
}
