/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // For Jest DOM matchers
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AddDepartment from "../component/AddDepartment";
import Swal from "sweetalert2";
import { BASE_URL } from "../configration/Config"; // Import BASE_URL

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
    jest.clearAllMocks();
  });

  test("renders the AddDepartment form", () => {
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

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

    fireEvent.change(input, { target: { value: "HR" } });
    
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

    const cancelButton = screen.getByText("CANCEL");
    fireEvent.click(cancelButton);

    expect(input.value).toBe("");
  });

  test("submits the form and calls the API", async () => {
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

    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/User/Department`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_name: "HR",
            description: ""
          }),
        })
      );
    });
  });

  test("shows a success alert when the department is added successfully", async () => {
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

    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

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

  test("validates empty input field", async () => {
    const mockPreventDefault = jest.fn();
    
    render(
      <MemoryRouter>
        <AddDepartment />
      </MemoryRouter>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields"
      })
    );
  });

  test("reloads the page after successful submission", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

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

    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  test("displays an error when the API call fails", async () => {
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

    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Error submitting data:",
        "Internal Server Error"
      );
    });
  });
});
