import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
    localStorage.clear();
});

test("shows login page for unauthenticated users", () => {
    render(<App />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
});

test("shows TORFA branding on login page", () => {
    render(<App />);
    expect(screen.getByText(/Transparent Order Routing Fairness Analyzer/i)).toBeInTheDocument();
});
