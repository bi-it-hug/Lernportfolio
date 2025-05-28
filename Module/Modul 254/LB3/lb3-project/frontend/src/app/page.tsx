import { redirect } from "next/navigation";
import nextConfig from "../../next.config";

export default function Index() {
    redirect(nextConfig.rootPage);
}
