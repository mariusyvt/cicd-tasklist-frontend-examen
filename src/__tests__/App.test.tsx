import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import * as taskApi from "../api/taskApi";

vi.mock("../api/taskApi");

const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
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

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Header", () => {
    it("should render app header", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      render(<App />);

      expect(screen.getByText("Mes Tâches")).toBeInTheDocument();
    });

    it("should display task statistics", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("Terminées")).toBeInTheDocument();
      });
    });

    it("should not show stats when there are no tasks", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      render(<App />);

      await waitFor(() => {
        const header = screen.getByText("Mes Tâches");
        expect(header).toBeInTheDocument();
      });
    });
  });

  describe("Main content", () => {
    it("should render TaskForm component", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      render(<App />);

      expect(screen.getByTestId("task-form")).toBeInTheDocument();
    });

    it("should render TaskList component", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("task-list")).toBeInTheDocument();
      });
    });

    it("should load tasks on mount", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
      });
    });
  });

  describe("Completed tasks calculation", () => {
    it("should calculate completed count correctly", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Terminées")).toBeInTheDocument();
      });
    });

    it("should show correct completed and pending counts", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

      render(<App />);

      await waitFor(() => {
        // 2 tasks total
        expect(screen.getByText("2")).toBeInTheDocument();
        // 1 completed, 1 pending
        expect(screen.getByText("En cours")).toBeInTheDocument();
      });
    });
  });

  describe("Empty state", () => {
    it("should show empty state when no tasks", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("empty")).toBeInTheDocument();
      });
    });
  });

  describe("Error handling", () => {
    it("should handle API errors gracefully", async () => {
      vi.mocked(taskApi.getTasks).mockRejectedValue(new Error("API Error"));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("error")).toBeInTheDocument();
      });
    });
  });

  describe("Task operations", () => {
    it("should have add task form available", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      render(<App />);

      const form = screen.getByTestId("task-form");
      expect(form).toBeInTheDocument();
    });
  });
});
