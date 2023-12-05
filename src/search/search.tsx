// decide chooses where to lead the user to
// given a search string

import { NextRouter, useRouter } from "next/router";
import { useRef } from "react";

//
type Decision =
  | {
      kind: "GUIDED";
      name: string;
      valid: true;
    }
  | {
      kind: "GUIDED_404";
      name: string;
      valid: false;
    }
  | {
      kind: "CUSTOM";
      name: string;
      valid: true;
    }
  | {
      kind: "CUSTOM_404";
      name: string;
      valid: false;
    }
  | {
      kind: "UNSUPPORTED_MULTIWORD";
      name: string;
      valid: false;
    };

function decide(query: string, available: string[]): Decision {
  if (!query.length) {
    throw new Error("empty query");
  }
  // Is a single character?
  // TODO is this enough for utf8?
  if (query.length === 1) {
    // Is it available?
    // TODO hash map?
    if (available.includes(query)) {
      //  Yes -> GUIDED
      return {
        kind: "GUIDED",
        name: query,
        valid: true,
      };
    } else {
      //  No -> GUIDED_404
      return {
        kind: "GUIDED_404",
        name: query,
        valid: false,
      };
    }
  } else {
    // Is multiple characters?
    //  Are they separated by spaces?
    if (query.includes(" ")) {
      return {
        kind: "UNSUPPORTED_MULTIWORD",
        name: query,
        valid: false,
      };
    } else {
      //     Are all characters available?
      if (
        query.split("").every((s) => {
          return available.includes(s);
        })
      ) {
        // CUSTOM
        return {
          kind: "CUSTOM",
          name: query,
          valid: true,
        };
      } else {
        // CUSTOM_404
        return {
          kind: "CUSTOM_404",
          name: query,
          valid: false,
        };
      }
    }
  }
}

function redirect(router: NextRouter, decision: Decision) {
  if (decision.valid) {
    switch (decision.kind) {
      case "GUIDED": {
        return router.push(`/draw/${decision.name}`);
      }
      case "CUSTOM": {
        return router.push(`/custom/${decision.name}`);
      }
    }
  }
}

function setErrorMessage(input: HTMLInputElement, decision: Decision) {
  if (!decision.valid) {
    switch (decision.kind) {
      case "GUIDED_404": {
        input.setCustomValidity("character not found in the database");
        break;
      }

      case "UNSUPPORTED_MULTIWORD": {
        input.setCustomValidity("multiwords are not supported");
        break;
      }

      case "CUSTOM_404": {
        input.setCustomValidity("one or more characters were not found");
        break;
      }
    }

    return;
  }

  // clear
  input.setCustomValidity("");
}

interface SearchProps {
  available: string[];
}
export default function Search(props: SearchProps) {
  const router = useRouter();
  const formRef = useRef();
  const inputRef = useRef();

  // TODO
  // use [Constraint validation API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)

  return (
    <form
      data-testid="search-form"
      ref={formRef}
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();

        // TODO type
        // https://github.com/testing-library/react-testing-library/issues/763#issuecomment-672148556
        const query = e.target.elements.query.value.trim();

        router.push(`/draw/${query}`);
      }}
    >
      <input
        ref={inputRef}
        type="text"
        required
        data-testid="search-query-input"
        name="query"
        onChange={(c: React.SyntheticEvent) => {
          // required should handle it
          if (!c.target.value.trim()) {
            return;
          }
          setErrorMessage(
            inputRef.current,
            decide(c.target.value.trim(), props.available)
          );
        }}
      />
    </form>
  );
}
