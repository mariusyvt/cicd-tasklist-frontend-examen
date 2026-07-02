import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTasks } from "../hooks/useTasks";
import * as taskApi from "../api/taskApi";

vi.mock("../api/taskApi");

const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Desc 1",
    completed: false,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Task 2",
    description: null,
    completed: true,
    createdAt: "2026-01-16T10:00:00Z",
    updatedAt: "2026-01-16T10:00:00Z",
  },
];

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadTasks", () => {
    it("should load tasks on mount", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.error).toBeNull();
    });

    it("should handle errors when loading tasks", async () => {
      const error = new Error("API Error");
      vi.mocked(taskApi.getTasks).mockRejectedValue(error);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("API Error");
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe("addTask", () => {
    it("should add a new task", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);
      const newTask = {
        id: 3,
        title: "New",
        description: "New Desc",
        completed: false,
        createdAt: "2026-01-17T10:00:00Z",
        updatedAt: "2026-01-17T10:00:00Z",
      };
      vi.mocked(taskApi.createTask).mockResolvedValue(newTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addTask({ title: "New", description: "New Desc" });

      await waitFor(() => {
        expect(result.current.tasks).toContainEqual(newTask);
      });
    });
  });

  describe("editTask", () => {
    it("should edit an existing task", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);
      const updatedTask = { ...mockTasks[0], title: "Updated" };
      vi.mocked(taskApi.updateTask).mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.editTask(1, { title: "Updated" });

      await waitFor(() => {
        expect(result.current.tasks[0].title).toBe("Updated");
      });
    });
  });

  describe("removeTask", () => {
    it("should remove a task", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);
      vi.mocked(taskApi.deleteTask).mockResolvedValue();

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.removeTask(1);

      await waitFor(() => {
        expect(result.current.tasks).not.toContainEqual(mockTasks[0]);
      });
    });
  });

  describe("toggleComplete", () => {
    it("should toggle task completion", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);
      const toggledTask = { ...mockTasks[0], completed: true };
      vi.mocked(taskApi.updateTask).mockResolvedValue(toggledTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.toggleComplete(1);

      await waitFor(() => {
        expect(result.current.tasks[0].completed).toBe(true);
      });
    });
  });
});
