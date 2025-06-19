import { pool } from "@/app/db/database";
import { queries } from "@/app/db/queries";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const target = await pool.query(queries.getTaskById, [params.id]);
    return Response.json(target[0]);
}
