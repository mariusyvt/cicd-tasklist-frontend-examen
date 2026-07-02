import { describe, it, expect } from "vitest";
import type { CreateTaskPayload, UpdateTaskPayload, Task } from "../types/task";

describe("Task Types", () => {
  it("should define CreateTaskPayload correctly", () => {
    const payload: CreateTaskPayload = {
      title: "Test",
      description: "Desc",
    };
    expect(payload.title).toBe("Test");
    expect(payload.description).toBe("Desc");
  });

  it("should define UpdateTaskPayload correctly", () => {
    const payload: UpdateTaskPayload = {
      title: "Updated",
      completed: true,
    };
    expect(payload.title).toBe("Updated");
    expect(payload.completed).toBe(true);
  });

  it("should define Task correctly", () => {
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Description",
      completed: false,
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: "2026-01-15T00:00:00Z",
    };
    expect(task.id).toBe(1);
    expect(task.title).toBe("Test Task");
    expect(task.completed).toBe(false);
  });
});
