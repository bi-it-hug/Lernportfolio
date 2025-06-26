import { Task } from "@/app/types/task";
import { pool } from "@/app/db/database";
import { queries } from "@/app/db/queries";
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Read Tasks
export async function GET() {
    try {
        const [rows] = (await pool.query(queries.getTasks)) as [RowDataPacket[], unknown];
        // Map the results to ensure completed is boolean
        const tasks = rows.map((row) => ({
            ...row,
            completed: Boolean(row.completed),
        }));
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

// Create Task
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 });
        }

        // Set default value for completed if not provided
        const completed = body.completed ?? false;
        if (typeof completed !== "boolean") {
            return NextResponse.json({ error: "Completed must be a boolean" }, { status: 400 });
        }

        const [result] = (await pool.query(queries.createTask, [body.name, completed])) as [ResultSetHeader, unknown];

        // Check if the task was created successfully
        if (!result.insertId) {
            return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
        }

        // Return the newly created task
        return NextResponse.json(
            {
                id: result.insertId,
                name: body.name,
                completed,
            } as Task,
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
