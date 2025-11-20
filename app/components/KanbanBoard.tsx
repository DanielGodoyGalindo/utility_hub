"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

type Task = { id: string; text: string };
type Column = { id: string; title: string; tasks: Task[] };

const initialData: Column[] = [
    { id: "todo", title: "Todo", tasks: [] },
    { id: "inprogress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
];

export default function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(initialData);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
    );

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("kanban");
        setColumns(saved ? JSON.parse(saved) : initialData);
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("kanban", JSON.stringify(columns));
    }, [columns]);

    function createTask(columnId: string) {
        const text = prompt("New task:");
        if (!text) return;

        setColumns((prev) =>
            prev.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [...col.tasks, { id: uuidv4(), text }],
                    }
                    : col
            )
        );
    }

    function deleteTask(taskId: string) {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                tasks: col.tasks.filter((t) => t.id !== taskId),
            }))
        );
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Find source column
        const sourceCol = columns.find((col) =>
            col.tasks.some((t) => t.id === activeId)
        );

        // Target may be a task OR a column droppable container
        const targetCol =
            columns.find((col) => col.tasks.some((t) => t.id === overId)) ||
            columns.find((col) => col.id === overId);

        if (!sourceCol || !targetCol) return;

        const sourceIdx = sourceCol.tasks.findIndex((t) => t.id === activeId);
        const task = sourceCol.tasks[sourceIdx];

        setColumns((prev) => {
            const next = structuredClone(prev);

            const from = next.find((col) => col.id === sourceCol.id);
            const to = next.find((col) => col.id === targetCol.id);

            // Remove from source
            from!.tasks = from!.tasks.filter((t) => t.id !== activeId);

            // Insert in correct order
            const toIndex = to!.tasks.findIndex((t) => t.id === overId);
            if (toIndex === -1) to!.tasks.push(task);
            else to!.tasks.splice(toIndex, 0, task);

            return next;
        });
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-3 gap-4 p-8">
                {columns.map((column) => (
                    <DroppableColumn column={column} key={column.id}>
                        <ColumnContent
                            column={column}
                            createTask={createTask}
                            deleteTask={deleteTask}
                        />
                    </DroppableColumn>
                ))}
            </div>
        </DndContext>
    );
}

// -----------------------------------------------------
// Droppable Column (allows dropping even when empty)
// -----------------------------------------------------
function DroppableColumn({ column, children }: { column: Column, children: any }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className="bg-gray-100 p-4 rounded-xl shadow-sm border min-h-[200px]"
        >
            {children}

            {/* Placeholder for empty columns */}
            {column.tasks.length === 0 && (
                <div className="h-12 mt-2 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400 text-sm">
                    Drop here
                </div>
            )}
        </div>
    );
}

// -----------------------------------------------------
// Column content (title + tasks + button)
// -----------------------------------------------------
function ColumnContent({
    column,
    createTask,
    deleteTask,
}: {
    column: Column;
    createTask: (columnId: string) => void;
    deleteTask: (taskId: string) => void;
}) {
    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">{column.title}</h2>
                {/* Create task button */}
                <button
                    onClick={() => createTask(column.id)}
                    className="text-white bg-blue-500 rounded px-2 py-1 text-sm hover: cursor-pointer"
                >
                    +
                </button>
            </div>

            <SortableContext
                items={column.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                {column.tasks.map((task) => (
                    <SortableTask key={task.id} task={task} deleteTask={deleteTask} />
                ))}
            </SortableContext>
        </>
    );
}

// -----------------------------------------------------
// Sortable Task (draggable item)
// -----------------------------------------------------
function SortableTask({ task, deleteTask }: { task: Task; deleteTask: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 mb-2 bg-white rounded-lg shadow border flex justify-between items-center hover:bg-gray-50 cursor-grab"
        >
            <span>{task.text}</span>
            {/* Delete button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                }}
                className="text-red-500 hover:text-red-700 font-bold px-2 cursor-pointer"
            >
                ✕
            </button>
        </div>
    );
}
