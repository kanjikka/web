import { useReducer } from "react";

// TODO circular buffer

// history
type CanvasState =
  | {
      type: "INIT";
      data: object;
    }
  | {
      type: "DRAW";
      data: object;
    }
  | {
      type: "UNDO";
      data: object;
    }
  | {
      type: "REDO";
      data: object;
    }
  | {
      type: "CLEAR";
      data: object;
    };
interface State {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
  clearState: object;
}

export type Action =
  | {
      type: "DRAW";
      data: object;
    }
  | {
      type: "UNDO";
    }
  | {
      type: "REDO";
    }
  | {
      type: "CLEAR";
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "DRAW": {
      const newPast = [...state.past, state.present];

      return {
        ...state,
        past: newPast,
        present: { type: action.type, data: action.data },
        future: [],
      };
    }

    case "UNDO": {
      // There's nothing to go back to
      if (state.present.type === "INIT" && state.past.length <= 0) {
        return {
          ...state,
        };
      }

      // No past to undo to
      const last = state.past[state.past.length - 1];
      if (!last) {
        return {
          ...state,
        };
      }
      const newPast = [...state.past.slice(0, state.past.length - 1)];
      const newFuture = [state.present, ...state.future];

      return {
        ...state,
        past: newPast,
        present: { ...last, type: "UNDO" },
        future: newFuture,
      };
    }

    case "REDO": {
      // nothing to redo to
      if (!state.future[0]) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        past: [...state.past, state.present],
        present: { type: "REDO", data: state.future[0].data },
        future: [...state.future.slice(1, state.future.length)],
      };
    }

    case "CLEAR": {
      const newPast = [...state.past, state.present];

      return {
        ...state,
        past: newPast,
        present: { type: action.type, data: state.clearState },
        future: [],
      };
    }
  }
}

const defaultInitialState: State = {
  past: [],
  present: null,
  future: [],
  clearState: null,
};

export function useHistory(
  clearState: object,
  initialState: Partial<State> = defaultInitialState
) {
  const state = {
    ...defaultInitialState,
    ...initialState,
    clearState,
  };

  // no present has been passed
  // let's consider it clean
  if (!state.present) {
    state.present = { type: "INIT", data: state.clearState };
  }

  const [history, dispatch] = useReducer(reducer, {
    ...state,
  });

  return {
    past: history.past,
    present: history.present,
    future: history.future,

    undo: dispatch.bind(null, { type: "UNDO" }),
    redo: dispatch.bind(null, { type: "REDO" }),
    draw: (e: object) => dispatch({ type: "DRAW", data: e }),
    clear: () => dispatch({ type: "CLEAR" }),
  };
}
