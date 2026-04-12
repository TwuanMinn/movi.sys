import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "@/stores/filter-store";

beforeEach(() => {
  useFilterStore.setState({ genre: "", status: "", search: "" });
});

describe("filter store", () => {
  it("starts with empty filters", () => {
    const { genre, status, search } = useFilterStore.getState();
    expect(genre).toBe("");
    expect(status).toBe("");
    expect(search).toBe("");
  });

  it("setGenre updates genre", () => {
    useFilterStore.getState().setGenre("thriller");
    expect(useFilterStore.getState().genre).toBe("thriller");
  });

  it("setStatus updates status", () => {
    useFilterStore.getState().setStatus("production");
    expect(useFilterStore.getState().status).toBe("production");
  });

  it("setSearch updates search", () => {
    useFilterStore.getState().setSearch("Crimson");
    expect(useFilterStore.getState().search).toBe("Crimson");
  });

  it("clearFilters resets all filters to empty string", () => {
    useFilterStore.getState().setGenre("drama");
    useFilterStore.getState().setSearch("test");
    useFilterStore.getState().clearFilters();
    const { genre, status, search } = useFilterStore.getState();
    expect(genre).toBe("");
    expect(status).toBe("");
    expect(search).toBe("");
  });
});
