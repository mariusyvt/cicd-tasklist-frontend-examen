import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList } from "../components/TaskList";
import type { Task } from "../types/task";

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Première tâche",
    description: "Description 1",
    completed: false,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Deuxième tâche",
    description: null,
    completed: true,
    createdAt: "2026-01-16T10:00:00Z",
    updatedAt: "2026-01-16T10:00:00Z",
  },
];

describe("TaskList", () => {
  describe("Loading state", () => {
    it("shows loading spinner", () => {
      render(
        <TaskList
          tasks={[]}
          loading={true}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByTestId("loading")).toBeInTheDocument();
      expect(screen.getByText("Chargement des tâches...")).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("shows empty state message", () => {
      render(
        <TaskList
          tasks={[]}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByTestId("empty")).toBeInTheDocument();
      expect(screen.getByText("Aucune tâche")).toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("shows error message", () => {
      render(
        <TaskList
          tasks={[]}
          loading={false}
          error="Network error"
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByText("Erreur : Network error")).toBeInTheDocument();
    });
  });

  describe("Task list rendering", () => {
    it("renders list of tasks", () => {
      render(
        <TaskList
          tasks={mockTasks}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByTestId("task-list")).toBeInTheDocument();
      expect(screen.getByText("Première tâche")).toBeInTheDocument();
      expect(screen.getByText("Deuxième tâche")).toBeInTheDocument();
    });

    it("displays task count", () => {
      render(
        <TaskList
          tasks={mockTasks}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("2 tâches")).toBeInTheDocument();
    });

    it("displays completed tasks count", () => {
      render(
        <TaskList
          tasks={mockTasks}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("1 terminée")).toBeInTheDocument();
    });

    it("renders correct number of TaskItem components", () => {
      render(
        <TaskList
          tasks={mockTasks}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      const taskItems = screen.getAllByTestId("task-item");
      expect(taskItems).toHaveLength(2);
    });

    it("handles single task", () => {
      render(
        <TaskList
          tasks={[mockTasks[0]]}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("1 tâche")).toBeInTheDocument();
    });

    it("handles all completed tasks", () => {
      const allCompleted = mockTasks.map((t) => ({ ...t, completed: true }));
      render(
        <TaskList
          tasks={allCompleted}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("2 tâches")).toBeInTheDocument();
      expect(screen.getByText("2 terminées")).toBeInTheDocument();
    });

    it("handles all pending tasks", () => {
      const allPending = mockTasks.map((t) => ({ ...t, completed: false }));
      render(
        <TaskList
          tasks={allPending}
          loading={false}
          error={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("0 terminée")).toBeInTheDocument();
    });
  });
});
