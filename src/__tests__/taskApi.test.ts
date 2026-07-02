import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";

const mockTask = {
  id: 1,
  title: "Test",
  description: null,
  completed: false,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

const mockTasks = [mockTask, { ...mockTask, id: 2, title: "Test 2" }];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("taskApi", () => {
  describe("getTasks", () => {
    it("should fetch all tasks successfully", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockTasks),
        }),
      );

      const tasks = await getTasks();
      expect(tasks).toEqual(mockTasks);
      expect(fetch).toHaveBeenCalledWith("/api/tasks");
    });

    it("should throw error on failed response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          text: () => Promise.resolve("Server Error"),
        }),
      );

      await expect(getTasks()).rejects.toThrow("HTTP 500: Server Error");
    });
  });

  describe("getTask", () => {
    it("should fetch a single task by id", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockTask),
        }),
      );

      const task = await getTask(1);
      expect(task).toEqual(mockTask);
      expect(fetch).toHaveBeenCalledWith("/api/tasks/1");
    });

    it("should handle 404 errors", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          text: () => Promise.resolve("Not Found"),
        }),
      );

      await expect(getTask(999)).rejects.toThrow("HTTP 404: Not Found");
    });
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const newTask = { title: "New Task", description: "Test" };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ ...mockTask, ...newTask, id: 3 }),
        }),
      );

      const result = await createTask(newTask);
      expect(result.title).toBe("New Task");
      expect(fetch).toHaveBeenCalledWith("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
    });

    it("should create task without description", async () => {
      const newTask = { title: "Task only" };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockTask,
              ...newTask,
              id: 4,
              description: null,
            }),
        }),
      );

      const result = await createTask(newTask);
      expect(result.description).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const updateData = { completed: true };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ ...mockTask, ...updateData }),
        }),
      );

      const result = await updateTask(1, updateData);
      expect(result.completed).toBe(true);
      expect(fetch).toHaveBeenCalledWith("/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    });

    it("should handle update errors", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          text: () => Promise.resolve("Bad Request"),
        }),
      );

      await expect(updateTask(1, { title: "" })).rejects.toThrow("HTTP 400");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
        }),
      );

      await deleteTask(1);
      expect(fetch).toHaveBeenCalledWith("/api/tasks/1", {
        method: "DELETE",
      });
    });

    it("should handle delete errors", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          text: () => Promise.resolve("Not Found"),
        }),
      );

      await expect(deleteTask(999)).rejects.toThrow("HTTP 404");
    });
  });
});
