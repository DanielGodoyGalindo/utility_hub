import AuthButton from "../components/AuthButton";
import BackButton from "../components/backButton";
import KanbanBoard from "../components/KanbanBoard";

export default function Page() {
    return (
        <div>
            <BackButton />
            <AuthButton />
            <h1 className="text-2xl mb-4 text-center font-bold">Kanban Board</h1>
            <KanbanBoard />
        </div>
    );
}
