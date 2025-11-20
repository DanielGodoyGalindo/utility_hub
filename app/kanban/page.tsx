import KanbanBoard from "../components/KanbanBoard";

export default function Page() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Kanban Board</h1>
            <KanbanBoard />
        </div>
    );
}
