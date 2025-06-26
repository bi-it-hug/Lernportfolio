import { pool } from "@/app/db/database";
import { queries } from "@/app/db/queries";
import type { Task } from "@/app/types/task";
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Get Task by ID
export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const [rows] = (await pool.query(queries.getTaskById, [taskId])) as [RowDataPacket[], unknown];

        if (!rows.length) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // Ensure completed is boolean
        const task = {
            ...rows[0],
            completed: Boolean(rows[0].completed),
        };

        return NextResponse.json(task as Task, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
    }
}

// Update Task
export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 });
        }

        if (typeof body.completed !== "boolean") {
            return NextResponse.json({ error: "Completed must be a boolean" }, { status: 400 });
        }

        const [result] = (await pool.query(queries.updateTask, [body.name, body.completed, taskId])) as [ResultSetHeader, unknown];

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // Return the updated task
        return NextResponse.json(
            {
                id: taskId,
                name: body.name,
                completed: body.completed,
            } as Task,
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

// Delete Task
export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const [result] = (await pool.query(queries.deleteTask, [taskId])) as [ResultSetHeader, unknown];

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
