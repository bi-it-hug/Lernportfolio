import { pool } from "@/app/db/database";
import { queries } from "@/app/db/queries";
import { Task } from "@/app/types/task";

export async function GET() {
    const target = await pool.query(queries.getTasks);
    return Response.json(target[0]);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name, completed } = body as Task;
    const result = await pool.query(queries.createTask, [name, completed]);
    return Response.json(result);
}
