"use client";

import config from "@/app/config";
import { IonIcon } from "./ion-icon";
import { Task } from "../models/task";
import { useState, useRef, useCallback, ReactNode } from "react";

export function TaskList({ data }: { data: Task[] }) {
    const [tasks, setTasks] = useState(data);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const inputRefs = useRef<Map<number, HTMLInputElement | null>>(new Map());

    const getInputRef = useCallback((taskId: number) => {
        if (!inputRefs.current.has(taskId)) {
            inputRefs.current.set(taskId, null);
        }
        return inputRefs.current.get(taskId);
    }, []);

    async function completeTask(task: Task) {
        try {
            const response = await fetch(`${config.url}/${config.endpoint}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, completed: !task.completed }),
            });

            if (response.ok) {
                setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
            }
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    }

    async function deleteTask(task: Task) {
        try {
            const response = await fetch(`${config.url}/${config.endpoint}/${task.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTasks(tasks.filter((t) => t.id !== task.id));
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }

    async function renameTask(task: Task) {
        const input = getInputRef(task.id);
        if (!input?.value) return;

        try {
            const response = await fetch(`${config.url}/${config.endpoint}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, name: input.value }),
            });

            if (response.ok) {
                setTasks(tasks.map((t) => (t.id === task.id ? { ...t, name: input.value } : t)));
                setEditingTaskId(null);
            }
        } catch (error) {
            console.error("Failed to rename task:", error);
        }
    }

    function checkKey(e: React.KeyboardEvent, task: Task) {
        if (e.key === "Enter") {
            renameTask(task);
        } else if (e.key === "Escape") {
            setEditingTaskId(null);
        }
    }

    function checkEdit(task: Task) {
        setEditingTaskId(task.id);
        setTimeout(() => {
            getInputRef(task.id)?.focus();
            getInputRef(task.id)?.select();
        }, 0);
    }

    return (
        <TaskListContent>
            {tasks.map((task) => (
                <li key={task.id} className={`group/item item ${task.completed ? "completed" : ""}`}>
                    <Bulletpoint task={task} />
                    <TaskName
                        task={task}
                        isEditing={editingTaskId === task.id}
                        inputRef={(el) => inputRefs.current.set(task.id, el)}
                        onKeyDown={(e) => checkKey(e, task)}
                        onBlur={() => setEditingTaskId(null)}
                    >
                        {task.name}
                    </TaskName>
                    <TaskActions>
                        <CompleteButton onComplete={() => completeTask(task)} />
                        <EditButton onEdit={() => checkEdit(task)} />
                        <DeleteButton onDelete={() => deleteTask(task)} />
                    </TaskActions>
                </li>
            ))}
        </TaskListContent>
    );
}

export function TaskListContent({ children }: { children: ReactNode }) {
    return <ul className="flex flex-col w-full h-fit border-t-(length:--border-width) border-(--border-color)">{children}</ul>;
}

export function TaskName({
    children,
    task,
    isEditing,
    inputRef,
    onKeyDown,
    onBlur,
}: {
    children: React.ReactNode;
    task: Task;
    isEditing: boolean;
    inputRef: (el: HTMLInputElement | null) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onBlur: () => void;
}) {
    return (
        <div className="relative text-sm font-normal w-fit whitespace-nowrap">
            <p
                className={`${task.completed ? "text-neutral-50/50 italic after:w-full after:opacity-100" : "text-neutral-50"} ${isEditing ? "opacity-0" : ""} after:absolute after:content-[] after:inset-y-0 after:left-0 after:w-0 after:opacity-0 after:h-[1px] after:bg-neutral-50 after:m-auto`}
            >
                {children}
            </p>
            <input
                ref={inputRef}
                type="text"
                placeholder={children?.toString()}
                defaultValue={children as string}
                className={`absolute inset-0 px-1 w-fit ${isEditing ? "" : "hidden"}`}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
            />
        </div>
    );
}

export function TaskActions({ children }: { children?: React.ReactNode }) {
    return <div className="w-fit h-fit flex gap-[0.3rem] opacity-0 group-hover/item:opacity-100">{children}</div>;
}

export function CompleteButton({ onComplete }: { onComplete: () => void }) {
    return (
        <button onClick={onComplete} className="group/button hover:bg-green-300/10 hover:border-green-300/20 action-button">
            <IonIcon Icon="CheckmarkDone" ClassName="text-neutral-50 group-hover/button:text-green-300 size-[0.9rem]" />
        </button>
    );
}

export function EditButton({ onEdit }: { onEdit: () => void }) {
    return (
        <button onClick={onEdit} className="group/button hover:bg-yellow-300/10 hover:border-yellow-300/20 action-button">
            <IonIcon Icon="Create" ClassName="group-hover/button:stroke-yellow-300 group-hover/button:text-yellow-300 size-[0.9rem]" />
        </button>
    );
}

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
    return (
        <button onClick={onDelete} className="group/button hover:bg-red-400/10 hover:border-red-400/20 action-button">
            <IonIcon Icon="Trash" ClassName="group-hover/button:text-red-400 size-[0.9rem]" />
        </button>
    );
}

export function Bulletpoint({ task }: { task: Task }) {
    return <IonIcon Icon="CaretForward" ClassName={`size-3.5 ml-3  ${task.completed ? "fill-neutral-50/50" : "fill-neutral-50"}`} />;
}
