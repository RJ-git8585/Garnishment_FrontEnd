/**
 * Exports the provided garnishment data to an Excel file.
 *
 * This function formats the input data using the `formatGarnishmentData` utility,
 * converts it into an Excel worksheet, and saves it as a file named "Garnishment_Data.xlsx".
 * If no valid data is found after formatting, an alert is displayed, and the export is aborted.
 *
 * @param {Array} response - The raw garnishment data to be exported.
 */
import * as XLSX from "xlsx";
import { formatGarnishmentData } from "../utils/dataFormatter";

export const exportToExcel = (response) => {
  const formattedData = formatGarnishmentData(response);

  if (formattedData.length === 0) {
    alert("No valid data found for export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Garnishment Data");

  XLSX.writeFile(workbook, "Garnishment_Data.xlsx");
};
