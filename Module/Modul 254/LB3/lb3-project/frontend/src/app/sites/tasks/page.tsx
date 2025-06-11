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

    return (
        <div className="flex flex-col gap-4">
            <TaskList data={tasks} />
        </div>
    );
}
