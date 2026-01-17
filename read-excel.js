const ExcelJS = require('exceljs');

async function readExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('NS CLIENT FILES -.xlsx');
  
  console.log('Sheets:', workbook.worksheets.map(ws => ws.name));
  
  workbook.worksheets.forEach(ws => {
    console.log(`\n=== ${ws.name} ===`);
    console.log(`Rows: ${ws.rowCount}, Columns: ${ws.columnCount}`);
    
    if (ws.rowCount > 0) {
      // Print header
      const headerRow = ws.getRow(1);
      const headers = headerRow.values.slice(1);
      console.log('Headers:', headers);
      
      // Print first 3 data rows
      for (let i = 2; i <= Math.min(4, ws.rowCount); i++) {
        const row = ws.getRow(i);
        const values = row.values.slice(1);
        console.log(`Row ${i}:`, values);
      }
    }
  });
}

readExcel().catch(console.error);
