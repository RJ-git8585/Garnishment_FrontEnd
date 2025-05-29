import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CaseRegister from "../pages/CaseRegister";
import '../utils/css/batch.css';

describe("CaseRegister Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all required input fields", () => {
    render(<CaseRegister />);
    
    // Check for some key labels to ensure fields are rendered
    expect(screen.getByLabelText(/Case ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Employee ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Federal Employer Identification Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Garnishment Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ordered Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Arrears Greater Than 12 Weeks/i)).toBeInTheDocument();
  });

  it("allows user to type into input fields", () => {
    render(<CaseRegister />);

    const caseIDInput = screen.getByLabelText(/Case ID/i);
    fireEvent.change(caseIDInput, { target: { value: "CASE123" } });
    expect(caseIDInput.value).toBe("CASE123");

    const eeIDInput = screen.getByLabelText(/Employee ID/i);
    fireEvent.change(eeIDInput, { target: { value: "EMP456" } });
    expect(eeIDInput.value).toBe("EMP456");
  });

  it("checks and unchecks the checkbox", () => {
    render(<CaseRegister />);
    const checkbox = screen.getByLabelText(/Arrears Greater Than 12 Weeks/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("submits the form and logs the data", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<CaseRegister />);

    fireEvent.change(screen.getByLabelText(/Case ID/i), { target: { value: "CASE789" } });
    fireEvent.change(screen.getByLabelText(/Employee ID/i), { target: { value: "EMP101" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(logSpy).toHaveBeenCalledWith(
      "Form data submitted:",
      expect.objectContaining({
        caseID: "CASE789",
        eeID: "EMP101"
      })
    );
  });

  it("resets the form when Reset button is clicked", () => {
    render(<CaseRegister />);

    const caseIDInput = screen.getByLabelText(/Case ID/i);
    fireEvent.change(caseIDInput, { target: { value: "RESET123" } });
    expect(caseIDInput.value).toBe("RESET123");

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(caseIDInput.value).toBe("");
  });
});
