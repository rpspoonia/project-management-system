import { useState } from "react";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
  type TaskStatus,
} from "./status";

type Props = {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
};

export default function TaskStatusDropdown({
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Status pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          transition
          hover:opacity-80
          ${TASK_STATUS_STYLES[value]}
        `}
      >
        {TASK_STATUS_LABELS[value]}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            z-10
            mt-2
            w-36
            rounded-xl
            bg-white
            shadow-lg
            ring-1
            ring-black/5
          "
        >
          {TASK_STATUSES.map((status) => {
            const isActive = status === value;

            return (
              <button
                key={status}
                disabled={isActive}
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-2
                  px-3
                  py-2
                  text-xs
                  text-left
                  transition
                  ${
                    isActive
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                <span
                  className={`
                    inline-block
                    h-2
                    w-2
                    rounded-full
                    ${TASK_STATUS_STYLES[status]}
                  `}
                />
                {TASK_STATUS_LABELS[status]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
