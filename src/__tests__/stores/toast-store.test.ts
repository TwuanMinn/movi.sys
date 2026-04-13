import { describe, it, expect, beforeEach, vi } from "vitest";
import { useToastStore, toast } from "@/stores/toast-store";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  vi.useFakeTimers();
});

describe("toast store", () => {
  it("adds a toast via show()", () => {
    useToastStore.getState().show({ type: "success", message: "Saved" });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]?.message).toBe("Saved");
    expect(useToastStore.getState().toasts[0]?.type).toBe("success");
  });

  it("assigns a unique id to each toast", () => {
    useToastStore.getState().show({ type: "info", message: "A" });
    useToastStore.getState().show({ type: "info", message: "B" });
    const ids = useToastStore.getState().toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });

  it("dismisses a toast by id", () => {
    useToastStore.getState().show({ type: "success", message: "Hi" });
    const id = useToastStore.getState().toasts[0]!.id;
    useToastStore.getState().dismiss(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("auto-dismisses after 4000ms", () => {
    useToastStore.getState().show({ type: "info", message: "Temp" });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(4001);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("toast.success() shorthand works", () => {
    toast.success("Upload complete", { title: "Done" });
    const t = useToastStore.getState().toasts[0];
    expect(t?.type).toBe("success");
    expect(t?.title).toBe("Done");
    expect(t?.message).toBe("Upload complete");
  });

  it("toast.error() shorthand works", () => {
    toast.error("Something broke");
    expect(useToastStore.getState().toasts[0]?.type).toBe("error");
  });
});
