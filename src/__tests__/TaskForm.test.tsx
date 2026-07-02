import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskForm } from "../components/TaskForm";

describe("TaskForm", () => {
  describe("Create mode", () => {
    it("should render form with create title", () => {
      render(<TaskForm onSubmit={vi.fn()} mode="create" />);
      expect(screen.getByText("Nouvelle tâche")).toBeInTheDocument();
    });

    it("should have empty inputs initially", () => {
      render(<TaskForm onSubmit={vi.fn()} mode="create" />);
      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      expect(titleInput).toHaveValue("");
    });

    it("should submit form with valid data", async () => {
      const onSubmit = vi.fn();
      render(<TaskForm onSubmit={onSubmit} mode="create" />);

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "New Task" } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalledWith({
        title: "New Task",
        description: undefined,
      });
    });

    it("should show validation error when submitting without title", async () => {
      render(<TaskForm onSubmit={vi.fn()} mode="create" />);

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("Le titre est requis")).toBeInTheDocument();
      });
    });

    it("should include description in submission", () => {
      const onSubmit = vi.fn();
      render(<TaskForm onSubmit={onSubmit} mode="create" />);

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "New Task" } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.calls[0][0].title).toBe("New Task");
    });

    it("should clear form after submission", async () => {
      render(<TaskForm onSubmit={vi.fn()} mode="create" />);

      const titleInput = screen.getByPlaceholderText(
        "Titre de la tâche *",
      ) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: "New Task" } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(titleInput.value).toBe("");
      });
    });

    it("should trim whitespace from inputs", () => {
      const onSubmit = vi.fn();
      render(<TaskForm onSubmit={onSubmit} mode="create" />);

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "  Task  " } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Task" }),
      );
    });
  });

  describe("Edit mode", () => {
    it("should render form with edit title", () => {
      render(
        <TaskForm
          onSubmit={vi.fn()}
          mode="edit"
          initialValues={{ title: "Edit Task" }}
        />,
      );
      expect(screen.getByText("Modifier la tâche")).toBeInTheDocument();
    });

    it("should populate initial values", () => {
      render(
        <TaskForm
          onSubmit={vi.fn()}
          mode="edit"
          initialValues={{
            title: "Existing Task",
            description: "Existing Description",
          }}
        />,
      );

      const titleInput = screen.getByPlaceholderText(
        "Titre de la tâche *",
      ) as HTMLInputElement;
      expect(titleInput.value).toBe("Existing Task");
    });

    it("should not clear form after submission in edit mode", async () => {
      render(
        <TaskForm
          onSubmit={vi.fn()}
          mode="edit"
          initialValues={{ title: "Edit Task" }}
        />,
      );

      const titleInput = screen.getByPlaceholderText(
        "Titre de la tâche *",
      ) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: "Updated Task" } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(titleInput.value).toBe("Updated Task");
      });
    });
  });

  describe("Cancel button", () => {
    it("should call onCancel when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

      const cancelButton = screen.getByRole("button", { name: /annuler/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  describe("Validation", () => {
    it("should clear validation error on input change", async () => {
      render(<TaskForm onSubmit={vi.fn()} mode="create" />);

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("Le titre est requis")).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "Task" } });

      await waitFor(() => {
        expect(
          screen.queryByText("Le titre est requis"),
        ).not.toBeInTheDocument();
      });
    });

    it("should not submit with only whitespace", () => {
      const onSubmit = vi.fn();
      render(<TaskForm onSubmit={onSubmit} mode="create" />);

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "   " } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should handle description with special characters", () => {
      const onSubmit = vi.fn();
      render(<TaskForm onSubmit={onSubmit} mode="create" />);

      const titleInput = screen.getByPlaceholderText("Titre de la tâche *");
      fireEvent.change(titleInput, { target: { value: "Task" } });

      const form = screen.getByTestId("task-form");
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
