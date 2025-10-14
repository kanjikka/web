import { cleanup, fireEvent, render } from "@testing-library/react";
import Search from "./search";

const useRouter = jest.spyOn(require("next/router"), "useRouter");
const available = ["九", "昨", "日"];

function r() {
  return render(<Search available={available} />);
}
describe("page redirects", () => {
  // Mock the router
  const router = { push: jest.fn() };
  useRouter.mockReturnValue(router);

  beforeEach(() => {
    router.push.mockClear();
  });

  it("redirects to /draw/{id} when single available character", () => {
    const el = render(<Search available={available} />);
    const input = el.getByTestId("search-query-input") as HTMLInputElement;
    const form = el.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "九" } });
    fireEvent.submit(form);

    expect(input.validity.customError).toBe(false);
    expect(router.push).toHaveBeenCalledWith("/draw/九");
  });

  it("shows error message when single UNAVAILABLE character", () => {
    const el = render(<Search available={available} />);
    const input = el.getByTestId("search-query-input") as HTMLInputElement;
    const form = el.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "_" } });
    fireEvent.submit(form);

    expect(input.validity.customError).toBe(true);
    expect(input.validationMessage).toBe("character not found in the database");

    expect(router.push).not.toHaveBeenCalled();
  });

  it("redirects to /custom/{word} when word with ALL available characters", () => {
    const el = render(<Search available={available} />);
    const input = el.getByTestId("search-query-input") as HTMLInputElement;
    const form = el.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "昨日" } });
    fireEvent.submit(form);

    expect(router.push).toHaveBeenCalledWith("/custom/昨日");
    expect(input.validity.customError).toBe(false);
  });

  it("shows error message when word with non available character(s)", () => {
    const el = render(<Search available={available} />);
    const input = el.getByTestId("search-query-input") as HTMLInputElement;
    const form = el.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "___" } });
    fireEvent.submit(form);

    expect(input.validity.customError).toBe(true);
    expect(input.validationMessage).toBe(
      "one or more characters were not found"
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it("shows error message when multiwords", () => {
    const el = render(<Search available={available} />);
    const input = el.getByTestId("search-query-input") as HTMLInputElement;
    const form = el.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "a b" } });
    fireEvent.submit(form);

    expect(input.validity.customError).toBe(true);
    expect(input.validationMessage).toBe("multiwords are not supported");
    expect(router.push).not.toHaveBeenCalled();
  });
});
