import Link from "next/link";
import { IonIcon } from "@/app/components/ion-icon";

export function Navigation() {
    return (
        <nav>
            <ul className="flex flex-col gap-1">
                <NavigationLink Href="home" Icon="Home" />
                <NavigationLink Href="settings" Icon="Cog" />
            </ul>
        </nav>
    );
}

export function NavigationLink({ Href, Icon }: { Href: string; Icon: string }) {
    return (
        <li className="flex w-fit">
            <Link
                href={Href.toLowerCase()}
                className="bg-(--main-background-color) border-(length:--border-width) border-(--border-color) flex justify-start items-center gap-1.5 px-3 py-1 w-32 capitalize text-sm text-neutral-50 hover:bg-neutral-800 rounded-lg"
            >
                <IonIcon Icon={Icon} ClassName="fill-neutral-50 size-4" />
                {Href}
            </Link>
        </li>
    );
}

{
    /* <div className="bg-(--main-background-color) absolute top-10 left-full flex p-1 rounded-r-md border-(--border-color) border-t-(length:--border-width) border-r-(length:--border-width) border-b-(length:--border-width)">
                        <IonIcon Icon="CaretBack" ClassName="size-5 fill-neutral-50/30" />
                    </div> */
}
