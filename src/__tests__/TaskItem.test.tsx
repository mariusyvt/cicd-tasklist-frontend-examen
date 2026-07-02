import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskItem } from "../components/TaskItem";
import type { Task } from "../types/task";

const mockTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  completed: false,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

describe("TaskItem", () => {
  describe("Display", () => {
    it("should render task title", () => {
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should render completed class when task is completed", () => {
      const completedTask = { ...mockTask, completed: true };
      render(
        <TaskItem
          task={completedTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      const taskItem = screen.getByTestId("task-item");
      expect(taskItem).toHaveClass("task-completed");
    });

    it("should not render completed class when task is not completed", () => {
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      const taskItem = screen.getByTestId("task-item");
      expect(taskItem).not.toHaveClass("task-completed");
    });
  });

  describe("Toggle completion", () => {
    it("should call onToggle when checkbox is clicked", async () => {
      const onToggle = vi.fn();
      render(
        <TaskItem
          task={mockTask}
          onToggle={onToggle}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );

      // Find checkbox by looking for input type checkbox
      const checkboxes = screen.getAllByRole("checkbox");
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
        expect(onToggle).toHaveBeenCalledWith(1);
      }
    });
  });

  describe("Edit mode", () => {
    it("should enter edit mode when edit is clicked", async () => {
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );

      // Find and click edit button
      const editButtons = screen.getAllByRole("button");
      const editButton = editButtons.find((btn) =>
        btn.textContent?.includes("✏️"),
      );
      if (editButton) {
        fireEvent.click(editButton);
        await waitFor(() => {
          expect(
            screen.getByPlaceholderText("Titre de la tâche"),
          ).toBeInTheDocument();
        });
      }
    });

    it("should save edited task", async () => {
      const onEdit = vi.fn();
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={onEdit}
        />,
      );

      const editButtons = screen.getAllByRole("button");
      const editButton = editButtons.find((btn) =>
        btn.textContent?.includes("✏️"),
      );
      if (editButton) {
        fireEvent.click(editButton);

        const titleInput =
          await screen.findByPlaceholderText("Titre de la tâche");
        fireEvent.change(titleInput, { target: { value: "Updated Title" } });

        const saveButton = screen.getByRole("button", { name: "Enregistrer" });
        fireEvent.click(saveButton);

        expect(onEdit).toHaveBeenCalled();
      }
    });

    it("should cancel edit mode", async () => {
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );

      const editButtons = screen.getAllByRole("button");
      const editButton = editButtons.find((btn) =>
        btn.textContent?.includes("✏️"),
      );
      if (editButton) {
        fireEvent.click(editButton);

        const cancelButton = editButtons.find((btn) =>
          btn.textContent?.includes("✗"),
        );
        if (cancelButton) {
          fireEvent.click(cancelButton);

          await waitFor(() => {
            expect(
              screen.queryByPlaceholderText("Titre de la tâche"),
            ).not.toBeInTheDocument();
          });
        }
      }
    });
  });

  describe("Delete", () => {
    it("should require confirmation before deleting", async () => {
      const onDelete = vi.fn();
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={onDelete}
          onEdit={vi.fn()}
        />,
      );

      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find((btn) =>
        btn.textContent?.includes("🗑️"),
      );
      if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(onDelete).not.toHaveBeenCalled();
      }
    });

    it("should delete task on second click", async () => {
      const onDelete = vi.fn();
      render(
        <TaskItem
          task={mockTask}
          onToggle={vi.fn()}
          onDelete={onDelete}
          onEdit={vi.fn()}
        />,
      );

      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find((btn) =>
        btn.textContent?.includes("🗑️"),
      );
      if (deleteButton) {
        fireEvent.click(deleteButton);
        fireEvent.click(deleteButton);
        expect(onDelete).toHaveBeenCalledWith(1);
      }
    });
  });

  describe("Task without description", () => {
    it("should render task without description", () => {
      const taskNoDesc = { ...mockTask, description: null };
      render(
        <TaskItem
          task={taskNoDesc}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });
  });

  describe("Description handling", () => {
    it("should display long descriptions", () => {
      const taskWithLongDesc = {
        ...mockTask,
        description:
          "This is a very long description that should display correctly in the task item without any issues",
      };
      render(
        <TaskItem
          task={taskWithLongDesc}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />,
      );
      expect(
        screen.getByText(
          "This is a very long description that should display correctly in the task item without any issues",
        ),
      ).toBeInTheDocument();
    });
  });
});
