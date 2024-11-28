import { getLink } from "@/svc/router";
import { useRef } from "react";

function getFieldName() {
  // Convoluted way to get the query param key
  // To be used in a field name
  // Since the page expects that in the query param
  const link = getLink({
    name: "SHOW",
    query: "",
  });

  const u = new URLSearchParams(link.split("?")[1]);
  const names = Array.from(u.keys());
  if (names.length !== 1) {
    throw new Error("Expected a single query param");
  }
  return names[0];
}
export default function Search() {
  const formRef = useRef();
  const inputRef = useRef();

  // TODO
  // use [Constraint validation API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)
  //
  // Convoluted way to get the query param key
  // To be used in a field
  const link = getLink({
    name: "SHOW",
    query: "",
  });

  const fieldName = getFieldName();

  return (
    <form
      data-testid="search-form"
      action={`${getLink({
        name: "SHOW",
        query: "",
      })}`}
      ref={formRef}
    >
      <input
        ref={inputRef}
        type="text"
        required
        data-testid="search-query-input"
        name={fieldName}
      />
    </form>
  );
}
