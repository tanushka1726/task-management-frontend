export default function TaskCard({ task, onToggle, onDelete }: any) {
  return (
    <div className="flex justify-between items-center border p-3 rounded mb-2">
      <span className={task.completed ? "line-through text-gray-400" : ""}>
        {task.title}
      </span>

      <div className="flex gap-2">
        <button onClick={() => onToggle(task.id)}>✔</button>
        <button onClick={() => onDelete(task.id)}>🗑</button>
      </div>
    </div>
  );
}
