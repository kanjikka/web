"use client";
import { getLink } from "@/svc/router";
import { useRouter } from "next/navigation";
//
//function getFieldName() {
//  // Convoluted way to get the query param key
//  // To be used in a field name
//  // Since the page expects that in the query param
//  const link = getLink({
//    name: "SHOW",
//    query: "",
//  });
//
//  const u = new URLSearchParams(link.split("?")[1]);
//  const names = Array.from(u.keys());
//  if (names.length !== 1) {
//    throw new Error("Expected a single query param");
//  }
//  return names[0];
//}
//

export default function Search() {
  const router = useRouter();
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      query: HTMLInputElement;
    };

    const link = getLink({
      name: "SHOW",
      query: formElements.query.value,
    });

    router.push(link);
  }

  return (
    <form onSubmit={onSubmit} data-testid="search-form">
      <input
        type="text"
        required
        data-testid="search-query-input"
        name={"query"}
      />
    </form>
  );
}
