import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Nav2TargetQueue from "../Nav2TargetQueue";

describe("Nav2TargetQueue", () => {
  it("renders the TARGET QUEUE header", () => {
    render(<Nav2TargetQueue />);
    expect(screen.getByText("TARGET QUEUE")).toBeInTheDocument();
  });
});
