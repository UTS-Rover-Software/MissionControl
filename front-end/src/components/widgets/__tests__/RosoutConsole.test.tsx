import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// --- Mocks for ESM / browser-only deps ------------------------------

// Mock the xterm CSS so Jest doesn't try to parse a .css file
jest.mock("xterm/css/xterm.css", () => ({}), { virtual: true });

// Mock xterm Terminal so we don't actually spin up a real terminal in tests
jest.mock("xterm", () => {
  return {
    Terminal: jest.fn().mockImplementation(() => ({
      loadAddon: jest.fn(),
      open: jest.fn(),
      clear: jest.fn(),
      writeln: jest.fn(),
      dispose: jest.fn(),
    })),
  };
});

// Mock xterm FitAddon
jest.mock("xterm-addon-fit", () => {
  return {
    FitAddon: jest.fn().mockImplementation(() => ({
      fit: jest.fn(),
    })),
  };
});

// Mock jsPDF so Jest doesn't try to load the ESM bundle
jest.mock("jspdf", () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      splitTextToSize: jest.fn((text: string) => [text]),
      text: jest.fn(),
      addPage: jest.fn(),
      save: jest.fn(),
      internal: {
        pageSize: {
          getHeight: () => 800,
        },
      },
    })),
  };
});

import RosoutConsole from "../RosoutConsole";

describe("RosoutConsole", () => {
  it("renders the LOG CONSOLE header", () => {
    render(<RosoutConsole />);
    expect(screen.getByText("LOG CONSOLE")).toBeInTheDocument();
  });
});
