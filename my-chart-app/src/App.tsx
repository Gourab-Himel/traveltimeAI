import React from "react";

const tasks = {
  backlog: [
    {
      id: 1,
      title: "Research Google Maps API",
      priority: "High",
    },
    {
      id: 2,
      title: "Create Project Structure",
      priority: "Medium",
    },
  ],
  progress: [
    {
      id: 3,
      title: "Build AI Route Prediction",
      priority: "High",
    },
    {
      id: 4,
      title: "Design Dashboard UI",
      priority: "Medium",
    },
  ],
  review: [
    {
      id: 5,
      title: "Test Travel Time Model",
      priority: "Low",
    },
  ],
  completed: [
    {
      id: 6,
      title: "Requirement Analysis",
      priority: "Done",
    },
    {
      id: 7,
      title: "Database Design",
      priority: "Done",
    },
  ],
};

const Card = ({ task }: any) => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition">
    <h3 className="font-semibold text-gray-800">{task.title}</h3>

    <span
      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold
      ${
        task.priority === "High"
          ? "bg-red-100 text-red-600"
          : task.priority === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : task.priority === "Low"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {task.priority}
    </span>
  </div>
);

const Column = ({ title, color, tasks }: any) => (
  <div className="bg-gray-100 rounded-2xl p-4 w-full">
    <div
      className={`text-white ${color} rounded-lg py-2 text-center font-bold mb-4`}
    >
      {title} ({tasks.length})
    </div>

    {tasks.map((task: any) => (
      <Card key={task.id} task={task} />
    ))}
  </div>
);

export default function KanbanBoard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        ✈️ Travel Time AI - Kanban Board
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Column
          title="Backlog"
          color="bg-gray-600"
          tasks={tasks.backlog}
        />

        <Column
          title="In Progress"
          color="bg-blue-600"
          tasks={tasks.progress}
        />

        <Column
          title="Review"
          color="bg-orange-500"
          tasks={tasks.review}
        />

        <Column
          title="Completed"
          color="bg-green-600"
          tasks={tasks.completed}
        />
      </div>
    </div>
  );
}