"use client";

import { Check, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { Task } from "@/app/types/task";

export function TaskList({ tasks }: { tasks: Task[] }) {
    const [taskState, setTaskState] = useState(tasks);
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex justify-start items-center py-1.75 gap-2 bg-neutral-950/10 dark:bg-neutral-900 text-sm font-normal w-full whitespace-nowrap rounded-lg">
                <Plus className="icon ml-2.5 dark:text-neutral-50" />
                <p className="dark:text-neutral-50/80">Add Task</p>
            </div>
            <ul className="flex flex-col w-full h-fit dark:bg-neutral-900 overflow-hidden rounded-lg">
                {Array.isArray(taskState) && taskState.length > 0 ? (
                    taskState.map((task) => (
                        <li
                            key={task.id}
                            className={`group/item grid grid-cols-[max-content_1fr_max-content] items-center justify-items-end gap-2 py-2 pr-1.25 ${
                                task.completed ? "completed" : ""
                            } not-last-of-type:border-b-1 not-last-of-type:dark:border-neutral-800 not-last-of-type:border-neutral-950/10 bg-neutral-950/10`}
                        >
                            <ChevronRight className={`icon ml-2.5 ${task.completed ? "dark:text-neutral-50/50" : "dark:text-neutral-50/80"}`} />
                            <div className="relative text-sm font-normal w-full whitespace-nowrap">
                                <p
                                    className={`${
                                        task.completed ? "dark:text-neutral-50/50 italic after:w-full after:opacity-100" : "dark:text-neutral-50/80"
                                    } leading-none after:absolute after:content-[] after:inset-y-0 after:left-0 after:w-0 after:opacity-0 after:h-0.5 after:m-auto dark:after:bg-neutral-50/80`}
                                >
                                    {task.name}
                                </p>
                                <input
                                    ref={(el) => {
                                        inputRefs.current[task.id] = el;
                                    }}
                                    type="text"
                                    placeholder={task.name}
                                    defaultValue={task.name}
                                    className={`absolute inset-0 px-1 w-fit dark:text-neutral-50/80`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const handleUpdate = async () => {
                                                try {
                                                    const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ ...task, name: (e.target as HTMLInputElement).value }),
                                                    });

                                                    if (!response.ok) {
                                                        throw new Error("Update failed");
                                                    }
                                                } catch (error) {
                                                    console.error("Failed to rename task:", error);
                                                }
                                            };
                                            handleUpdate();
                                        }
                                    }}
                                />
                            </div>
                            <div className="w-full h-fit flex gap-[0.3rem] opacity-0 group-hover/item:opacity-100">
                                <button
                                    onClick={() => {
                                        const handleToggle = async () => {
                                            try {
                                                const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ ...task, completed: !task.completed }),
                                                });

                                                if (response.ok) {
                                                    setTaskState(taskState.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
                                                }
                                            } catch (error) {
                                                console.error("Failed to update task:", error);
                                            }
                                        };
                                        handleToggle();
                                    }}
                                    className="group/button hover:bg-green-300/10 hover:border-green-300/20 action-button"
                                >
                                    <Check className="icon dark:text-neutral-500 group-hover/button:text-green-300" />
                                </button>
                                <button
                                    onClick={() => {
                                        const handleRename = async () => {
                                            try {
                                                const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ ...task, name: inputRefs.current[task.id]?.value }),
                                                });

                                                if (response.ok) {
                                                    setTaskState(taskState.map((t) => (t.id === task.id ? { ...t, name: inputRefs.current[task.id]?.value ?? "" } : t)));
                                                }
                                            } catch (error) {
                                                console.error("Failed to rename task:", error);
                                            }
                                        };
                                        handleRename();
                                    }}
                                    className="group/button hover:bg-yellow-300/10 hover:border-yellow-300/20 action-button"
                                >
                                    <Pencil className="icon dark:text-neutral-500 group-hover/button:text-yellow-300" />
                                </button>
                                <button
                                    onClick={() => {
                                        const handleDelete = async () => {
                                            try {
                                                const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                                                    method: "DELETE",
                                                });

                                                if (response.ok) {
                                                    setTaskState(taskState.filter((t) => t.id !== task.id));
                                                }
                                            } catch (error) {
                                                console.error("Failed to delete task:", error);
                                            }
                                        };
                                        handleDelete();
                                    }}
                                    className="group/button hover:bg-red-400/10 hover:border-red-400/20 action-button"
                                >
                                    <Trash2 className="icon dark:text-neutral-500 group-hover/button:text-red-400" />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="item">
                        <p className="dark:text-neutral-50/80">No tasks found.</p>
                    </li>
                )}
            </ul>
        </div>
    );
}
