import config from "@/app/config";
import { TaskList } from "@/app/components/task-list";

export default async function home() {
    let tasks = [];

    try {
        const data = await fetch(`${config.url}/${config.endpoint}`);
        tasks = await data.json();
    } catch (error) {
        console.error(error);
    }

    return <TaskList data={tasks} />;
}
