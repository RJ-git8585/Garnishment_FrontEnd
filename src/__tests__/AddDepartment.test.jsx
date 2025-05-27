/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // For Jest DOM matchers
import { BrowserRouter, MemoryRouter } from "react-router-dom"; // Import both routers
import AddDepartment from "../component/AddDepartment";
import Swal from "sweetalert2"; // Import Swal for mocking

// Mock Swal
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({}),
}));

// Mock console.error
console.error = jest.fn();

// Mock sessionStorage
beforeAll(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn((key) => {
        if (key === "id") return "123"; // Mock employer_id
        return null;
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

// Mock fetch API
global.fetch = jest.fn();

describe("AddDepartment Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("renders the AddDepartment form", () => {
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText("Department")).toBeInTheDocument();
    expect(screen.getByText("ADD")).toBeInTheDocument();
    expect(screen.getByText("CANCEL")).toBeInTheDocument();
  });

  test("updates the input field when typing", () => {
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    const addButton = screen.getByText("ADD");
    
    expect(input.value).toBe("");
    expect(addButton).not.toBeDisabled();

    // Type into the input field
    fireEvent.change(input, { target: { value: "HR" } });
    
    // Check if the input value is updated
    expect(input.value).toBe("HR");
    expect(addButton).not.toBeDisabled();
  });

  test("resets the input field when clicking the CANCEL button", () => {
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    fireEvent.change(input, { target: { value: "HR" } });

    // Click the CANCEL button
    const cancelButton = screen.getByText("CANCEL");
    fireEvent.click(cancelButton);

    // Check if the input value is reset
    expect(input.value).toBe("");
  });

  test("submits the form and calls the API", async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    fireEvent.change(input, { target: { value: "HR" } });

    // Click the ADD button
    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/User/Department", // Replace with actual BASE_URL if different
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employer_id: "123", department_name: "HR" }),
        })
      );
    });
  });

  test("shows a success alert when the department is added successfully", async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    fireEvent.change(input, { target: { value: "Finance" } });

    // Click the ADD button
    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    // Wait for the success alert to appear
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Department Added",
        })
      );
    });
  });

  test("does not call the API if the input field is empty", async () => {
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const addButton = screen.getByText("ADD");

    // Click the ADD button without entering any input
    fireEvent.click(addButton);

    // Ensure fetch is not called
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  test("reloads the page after successful submission", async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    // Mock window.location.reload
    const reloadMock = jest.fn();
    delete window.location;
    window.location = { reload: reloadMock };

    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    fireEvent.change(input, { target: { value: "IT" } });

    // Click the ADD button
    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    // Wait for the page reload to be triggered
    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  test("displays an error when the API call fails", async () => {
    // Mock fetch response with an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Department");
    fireEvent.change(input, { target: { value: "HR" } });

    // Click the ADD button
    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Error submitting data:",
        "Internal Server Error"
      );
    });
  });
});
