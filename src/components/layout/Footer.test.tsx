import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Footer from "./Footer";

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("<Footer/>", () => {
  test("contains JBBeauty link", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/JBBeauty/i);
    expect(footerElement).toBeInTheDocument();
  });
});
