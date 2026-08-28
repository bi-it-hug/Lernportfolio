import { TaskList } from "@/app/components/task-list";

export default async function home() {
    let tasks = [];

    try {
        const data = await fetch("http://localhost:3000/api/tasks", { cache: "no-store" });
        tasks = await data.json();
        console.log("Fetched tasks:", tasks);
    } catch (error) {
        console.error(error);
    }

    return <TaskList tasks={tasks} />;
}
