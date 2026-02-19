"use client";
export default function TaskFilters({ setSearch, setStatus }: any) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        placeholder="Search tasks"
        className="border p-2 flex-1"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>
    </div>
  );
}
