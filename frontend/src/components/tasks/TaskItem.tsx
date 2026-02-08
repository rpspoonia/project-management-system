import { useState } from "react";
import type { Task } from "./types";
import TaskView from "./TaskView";
import TaskEditForm from "./TaskEditForm";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className="
        rounded-xl
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        ease-out
        hover:shadow-md
      "
    >
      {isEditing ? (
        <TaskEditForm
          task={task}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <TaskView
          task={task}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
