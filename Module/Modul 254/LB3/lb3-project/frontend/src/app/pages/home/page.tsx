import env from "@/app/env";
import { Main } from "@/app/components/main";
import { Card, CardTitle, CardHeader, CardContent } from "@/app/components/card";
import { TaskList } from "@/app/components/task-list";

export default async function Home() {
    const data = await fetch(`${env.url}/${env.endpoint}`);
    const tasks = await data.json();

    return (
        <Main>
            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <TaskList data={tasks} />
                </CardContent>
            </Card>
        </Main>
    );
}
