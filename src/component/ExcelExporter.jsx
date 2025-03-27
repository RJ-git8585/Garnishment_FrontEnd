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
