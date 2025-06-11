import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { queries } from "./db/queries";
import pool from "./db/database";

const app = new Elysia()
    .use(
        cors({
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        })
    )

    .options("/tasks/:id", () => new Response(null, { status: 204 }))

    .get("/", () => "LB3-Project")

    .get("/tasks", async () => {
        const [rows] = (await pool.query(queries.getTasks)) as [any[], any];
        return rows.map((task) => ({
            ...task,
            completed: task.completed === 1,
        }));
    })

    .get("/tasks/:id", async ({ params }) => {
        const [rows] = await pool.query(queries.getTaskById, [params.id]);

        return {
            ...rows[0],
            completed: rows[0].completed === 1,
        };
    })

    .put("/tasks/:id", async ({ params, body }) => {
        const { name, completed } = body as {
            name: string;
            completed: boolean;
        };
        await pool.query(queries.updateTask, [name, completed ? 1 : 0, params.id]);
        return { success: true };
    })

    .delete("/tasks/:id", async ({ params }) => {
        const { id } = params;
        await pool.query(queries.deleteTask, [id]);
        return { success: true };
    })

    .listen(3000);

console.log(`🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`);
