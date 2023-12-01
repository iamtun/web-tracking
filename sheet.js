import * as XLSX from "node-xlsx";
import fs from "fs";

const FILE_NAME = "tracking_site.xlsx";

export const createWorkBook = () => {
  // Create a new worksheet with headers
  const sheet = [["Site", "Status", "Date", "Time"]];

  // Create a new Excel file
  const buffer = XLSX.build([{ name: "Sheet 1", data: sheet }]);

  // Save the file to disk
  fs.writeFileSync(FILE_NAME, buffer);

  console.log("Excel file created successfully.");
};

const addRecordToSheet = (sheet, record) => {
  sheet.push(record);
};

export const addRecord = (record) => {
  // Load the existing Excel file
  const existingData = XLSX.parse(fs.readFileSync(FILE_NAME));

  // Get the first sheet
  const existingSheet = existingData[0].data;

  // Add a new record
  addRecordToSheet(existingSheet, record);

  // Save the updated data to a new Excel file
  const buffer = XLSX.build(existingData);
  fs.writeFileSync(FILE_NAME, buffer);

  console.log(JSON.stringify(record));
};
