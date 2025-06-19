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

    createTask: `
        INSERT INTO tasks (name, completed)
        VALUES (?, ?)
    `,

    updateTask: `
        UPDATE tasks
        SET name = ?, completed = ?
        WHERE id = ?
    `,

    deleteTask: `
        DELETE FROM tasks
        WHERE id = ?
    `,
};
