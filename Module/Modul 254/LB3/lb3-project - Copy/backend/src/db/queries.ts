export const queries = {
    getTasks: `
        SELECT *
        FROM tasks
    `,

    getTaskById: `
        SELECT *
        FROM tasks
        WHERE id = ?
    `,

    updateTask: `
        UPDATE tasks
        SET name = ?,
        completed = ?
        WHERE id = ?
    `,

    deleteTask: `
        DELETE FROM tasks
        WHERE id = ?
    `,
};
