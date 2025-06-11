import { redirect } from "next/navigation";
import config from "@/app/config";

export default function Index() {
    redirect(config.rootPage);
}
