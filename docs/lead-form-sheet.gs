/*
  Fidgital World lead form → Google Sheet.
  Paste this whole file into Extensions → Apps Script of your leads sheet.
  Step-by-step: docs/lead-form-setup.md
*/
const COLUMNS = [
  "submittedAt", "product", "intent", "parentName", "phone", "email", "childAge",
  "source", "page", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    const data = JSON.parse(e.postData.contents || "{}");
    // Cap every value so a bad request can't flood the sheet.
    sheet.appendRow(COLUMNS.map(k => String(data[k] == null ? "" : data[k]).slice(0, 300)));
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
