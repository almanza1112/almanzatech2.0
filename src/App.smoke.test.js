import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the whole page without crashing", () => {
  render(<App />);

  expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);

  // Key conversion paths are present and tappable.
  expect(screen.getAllByRole("link", { name: /201/ }).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  expect(screen.getByRole("button", { name: /open menu/i })).toBeTruthy();
});
