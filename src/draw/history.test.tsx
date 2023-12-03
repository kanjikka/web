import { useHistory } from "./history";
import { renderHook, act } from "@testing-library/react-hooks";

const cleanState = { name: "pristine state" };

it("should use a custom present state if appropriate", () => {
  const { result } = renderHook(() =>
    useHistory(cleanState, {
      present: {
        type: "DRAW",
        data: { name: "my path" },
      },
    })
  );

  expect(result.current.present).toEqual({
    type: "DRAW",
    data: {
      name: "my path",
    },
  });
});

it("should generate a present from cleanState when no present is initialized", () => {
  const { result } = renderHook(() => useHistory(cleanState));

  expect(result.current.present).toEqual({
    type: "INIT",
    data: { name: "pristine state" },
  });
});

it("should never go back further than the init state", () => {
  const { result } = renderHook(() => useHistory(cleanState));

  act(() => {
    result.current.undo();
    result.current.undo();
    result.current.undo();
    result.current.undo();
    result.current.undo();
  });

  expect(result.current.present).toEqual({
    type: "INIT",
    data: {
      name: "pristine state",
    },
  });
  expect(result.current.past).toHaveLength(0);
  expect(result.current.future).toHaveLength(0);
});

it("should stay in the same place when there's nothing to redo to", () => {
  const { result } = renderHook(() => useHistory(cleanState));

  act(() => {
    result.current.redo();
    result.current.redo();
    result.current.redo();
    result.current.redo();
    result.current.redo();
  });

  expect(result.current.present).toEqual({
    type: "INIT",
    data: { name: "pristine state" },
  });
  expect(result.current.past).toHaveLength(0);
  expect(result.current.future).toHaveLength(0);
});

it("should not undo when there's no past to go to", () => {
  const { result } = renderHook(() => useHistory(cleanState));

  const drawEvent1 = { name: "draw event 1" };
  act(() => {
    result.current.draw(drawEvent1);
    result.current.undo();
    result.current.undo();
  });

  expect(result.current.present).toEqual({
    type: "UNDO",
    data: { name: "pristine state" },
  });
  expect(result.current.past).toHaveLength(0);
  expect(result.current.future).toEqual([
    {
      type: "DRAW",
      data: drawEvent1,
    },
  ]);
});

it("should work", () => {
  const { result } = renderHook(() => useHistory(cleanState));

  // Initial state:
  expect(result.current.present).toEqual({
    type: "INIT",
    data: { name: "pristine state" },
  });
  expect(result.current.past).toEqual([]);
  expect(result.current.future).toEqual([]);

  // --------------------------
  const drawEvent1 = { name: "draw event 1" };
  act(() => {
    result.current.draw(drawEvent1);
  });

  expect(result.current.present).toEqual({
    type: "DRAW",
    data: drawEvent1,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
  ]);
  expect(result.current.future).toHaveLength(0);
  // --------------------------

  // Draw again
  const drawEvent2 = { name: "draw event 2" };
  act(() => {
    result.current.draw(drawEvent2);
  });

  expect(result.current.present).toEqual({
    type: "DRAW",
    data: drawEvent2,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
    {
      type: "DRAW",
      data: drawEvent1,
    },
  ]);
  expect(result.current.future).toHaveLength(0);

  // --------------------------
  // Draw again
  const drawEvent3 = { name: "draw event 2" };
  act(() => {
    result.current.draw(drawEvent2);
  });

  expect(result.current.present).toEqual({
    type: "DRAW",
    data: drawEvent3,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
    {
      type: "DRAW",
      data: drawEvent1,
    },
    {
      type: "DRAW",
      data: drawEvent2,
    },
  ]);
  expect(result.current.future).toHaveLength(0);
  // --------------------------
  // Undo
  act(() => {
    result.current.undo();
  });

  expect(result.current.present).toEqual({
    type: "UNDO",
    data: drawEvent2,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
    {
      type: "DRAW",
      data: drawEvent1,
    },
  ]);
  expect(result.current.future).toEqual([
    {
      type: "DRAW",
      data: drawEvent3,
    },
  ]);
  // --------------------------
  // Redo
  act(() => {
    result.current.redo();
  });
  expect(result.current.present).toEqual({
    type: "REDO",
    data: drawEvent3,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
    {
      type: "DRAW",
      data: drawEvent1,
    },
    {
      type: "UNDO",
      data: drawEvent2,
    },
  ]);
  expect(result.current.future).toHaveLength(0);

  // --------------------------
  // Clear
  act(() => {
    result.current.clear();
  });
  expect(result.current.present).toEqual({
    type: "CLEAR",
    data: cleanState,
  });
  expect(result.current.past).toEqual([
    {
      type: "INIT",
      data: { name: "pristine state" },
    },
    {
      type: "DRAW",
      data: drawEvent1,
    },
    {
      type: "UNDO",
      data: drawEvent2,
    },
    {
      type: "REDO",
      data: drawEvent3,
    },
  ]);
});
