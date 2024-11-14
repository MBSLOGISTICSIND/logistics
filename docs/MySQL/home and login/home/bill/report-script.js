document.addEventListener("DOMContentLoaded", function () {
    // Load saved bills from localStorage and display them in the report table
    loadReports();

    // Search functionality
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", searchReports);
}); 

async function loadReports() {
    console.log("Loading reports..."); // Log the loading process
    const reportsBody = document.getElementById('reportsBody');
    if (!reportsBody) {
        console.error("reportsBody element not found!");
        return;
    }
    reportsBody.innerHTML = ''; // Clear existing content

    // Fetch bills from the server
    let serverBills = [];
    try {
        const response = await fetch('https://logistics-87vc.onrender.com/api/get-bills');
        if (!response.ok) {
            console.error('Fetch error: ', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }
        serverBills = await response.json();
    } catch (error) {
        console.error('Error fetching bills from server:', error);
    }

    // Combine server bills and local storage bills
    const allBills = [...serverBills, ...JSON.parse(localStorage.getItem('bills')) || []]; // Merging both arrays
    console.log("Combined bills:", allBills);

    // Create a map to filter out duplicate lrNo while keeping the latest entry
    const uniqueBillsMap = new Map();

    allBills.forEach(bill => {
        if (bill && bill.lrNo) { // Ensure bill is valid and has lrNo
            const existingBill = uniqueBillsMap.get(bill.lrNo);
            // Compare dates and keep the latest one
            if (!existingBill || new Date(bill.date) > new Date(existingBill.date)) {
                uniqueBillsMap.set(bill.lrNo, bill);
            }
        }
    });

    // Convert the map values back to an array
    const uniqueBills = Array.from(uniqueBillsMap.values());
    console.log("Unique bills (latest by lrNo):", uniqueBills);

    if (uniqueBills.length === 0) {
        reportsBody.innerHTML = '<tr><td colspan="14">No bills saved.</td></tr>';
        return;
    }

    uniqueBills.forEach((bill, index) => {
        // Parse goodsEntries if it is a string
        if (typeof bill.goodsEntries === 'string') {
            try {
                bill.goodsEntries = JSON.parse(bill.goodsEntries);
            } catch (error) {
                console.error('Error parsing goodsEntries for bill:', bill, error);
                bill.goodsEntries = []; // Fallback to an empty array if parsing fails
            }
        }
    
        // Check if goodsEntries is an array
        if (Array.isArray(bill.goodsEntries)) {
            // Sum the total number of articles from the goods entries
            const totalNoOfArticles = bill.goodsEntries.reduce((sum, entry) => sum + (parseInt(entry.noOfArticles) || 0), 0);
            const total = bill.total || bill.totalAmount || 0; // Use total saved in the bill object directly
            const row = `<tr>
                <td>${bill.lrNo}</td>
                <td>${new Date(bill.date).toLocaleDateString()}</td>
                <td>${bill.gstPaidBy}</td>
                <td>${bill.paymentMode}</td>
                <td>${bill.from}</td>
                <td>${bill.to}</td>
                <td>${bill.consignor}</td>
                <td>${bill.consignorAddress}</td>
                <td>${bill.consignee}</td>
                <td>${bill.consigneeAddress}</td>
                <td>${bill.consigneeInvoiceNo}</td>
                <td>${totalNoOfArticles}</td> 
                <td>${total}</td>
                <td>
                    <button onclick="editBill(${index})">Edit</button>
                    <button onclick="deleteBill(${index})">Delete</button>
                </td>
            </tr>`;
            console.log("Adding row for bill:", bill); // Log the bill being added
            reportsBody.innerHTML += row;
        } else {
            console.error(`goodsEntries is not an array for bill:`, bill);
        }
    });
}    


// Ensure loadReports is called when reports section is displayed
document.getElementById("goToReportsBtn").addEventListener("click", function () {
    loadReports(); // Ensure that reports are loaded when button is clicked
    const reportsSection = document.getElementById("reports-section");
    reportsSection.scrollIntoView({ behavior: 'smooth' });
}); 




// Function to search reports
function searchReports() {
    const filter = document.getElementById("search-input").value.toUpperCase();
    const table = document.getElementById("reports-table");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    match = true;
                    break;
                }
            }
        }

        tr[i].style.display = match ? "" : "none";
    }
}

// Function to sort table by column
function sortTable(columnIndex) {
    const table = document.getElementById("reports-table");
    let switching = true;
    let shouldSwitch;
    let switchCount = 0;
    let dir = "asc";

    while (switching) {
        switching = false;
        const rows = table.rows;

        for (let i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            const x = rows[i].getElementsByTagName("TD")[columnIndex];
            const y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Function to edit a bill
function editBill(index) {
    const bills = JSON.parse(localStorage.getItem("bills")) || [];
    const bill = bills[index];

    // Redirect to billing form and load the selected bill
    window.location.href = "index1.html";
    localStorage.setItem("editBillIndex", index); // Save the index for editing in the form
}

// Function to delete a bill
function deleteBill(index) {
    const bills = JSON.parse(localStorage.getItem("bills")) || [];
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    loadReports(); // Refresh the report table after deletion
}


function exportToExcel() {
    // Get the table element
    var table = document.getElementById("reports-table");
    var rows = table.rows;
    var csvContent = "data:text/csv;charset=utf-8,";

    // Loop through the rows and create CSV content
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll("td, th");
        var rowData = Array.from(cols).map(col => col.innerText).join(",");
        csvContent += rowData + "\r\n"; // Add line breaks
    }

    // Create a link and trigger a download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "billing_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function printTable() {
    // Get the table body from the modal
    const billTableBody = document.getElementById('billTableBody');
    
    // Collect the filled data into a string
    let tableHTML = '<table style="width:100%; border-collapse: collapse;">';
    tableHTML += `
        <thead>
            <tr>
                <th>LR No</th>
                <th>Date</th>
                <th>To</th>
                <th>Invoice No</th>
                <th>Articles</th>
                <th>Rate</th>
                <th>GC.C</th>
                <th>Total Amount</th>
            </tr>
        </thead>
        <tbody>
    `;
    
     // Get the bill number, recipient's name and address, and month/year from input fields
     const billNo = document.getElementById('billNoInput').value;
     const recipientName = document.getElementById('recipientName').value;
     const recipientAddress = document.getElementById('recipientAddress').value;
     const monthYear = document.getElementById('monthYearInput').value; // Format: YYYY-MM
     
     // Initialize total amount variable
    let totalAmount = 0;



    // Loop through each row in the billTableBody
    Array.from(billTableBody.rows).forEach(row => {
        tableHTML += '<tr>';
        
        // Loop through each cell in the row
        Array.from(row.cells).forEach((cell, index) => { // Include index here
            // Check if the cell has an input field and get its value
            const input = cell.querySelector('input');
            if (input) {
                tableHTML += `<td style="border: 1px solid black; padding: 8px;">${input.value}</td>`;
            } else {
                tableHTML += `<td style="border: 1px solid black; padding: 8px;">${cell.innerHTML}</td>`;
            }

            // If it's the last cell (Total Amount), add its value to the totalAmount
            if (index === 7) { // Assuming the 8th column is the Total Amount column
                totalAmount += parseFloat(cell.innerText) || 0;
            }
        });

        tableHTML += '</tr>';
    });

    tableHTML += `</tbody></table>`;

    // Convert total amount to words
    const totalAmountWords = numberToWords(totalAmount);
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Bill</title>
                <style>
                  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    padding: 20px;
    line-height: 1.6;
}
.header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.header .logo img {
    width: 150px; /* Adjust size as needed */
    height: auto;
    display: block;
    margin: 0 auto;
}

.header .company-info {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
    text-align: center; /* Center-align the company info */
}

h2 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 24px;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 1px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
}

table th, table td {
    border: 1px solid #ccc;
    padding: 10px 15px;
    text-align: left;
}

th {
    background-color: #f4f4f4;
    font-weight: 600;
    text-transform: uppercase;
}

td {
    font-size: 14px;
}

.total {
    text-align: right;
    font-weight: bold;
    font-size: 16px;
}

.footer {
    margin-top: 30px;
    font-size: 14px;
    color: #777;
}

.footer p {
    margin: 5px 0;
}

.clear {
    clear: both;
}

@media print {
    body {
        padding: 0;
        margin: 0;
    }
    
    .header, .footer {
        page-break-inside: avoid;
    }
}

                </style>
            </head>
            <body>
               <div class="header">
                   
                    <div class="company-info">
                        <p>GST No: 1234567890</p>
                        <p>Phone: +91 9876543210</p>
                    </div>
                    <div class="clear"></div>
                   <h1>
    <img src="MBSLOGO.jpg" alt="MBS Lorry Service" style="width: 50%; height: auto;">
</h1>
                    <h3>H.O: No 91, New No 86, 3rd Main Road, N.T. Pet, Bangalore-02</h3>
                </div>
                
                <h2>Billing Details</h2>
                <p><strong>Bill No:</strong> ${billNo}</p> <!-- Use the bill number from input -->
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              
                  <p><strong>TO:</strong> ${recipientName}<br>${recipientAddress}</p> <!-- Recipient details -->

                <p><em>Dear Sir,</em></p>
                <p><em>Statement of Accounts for the monthly bill of ${monthYear ? new Date(monthYear).toLocaleString('default', { month: 'long' }) + ' ' + new Date(monthYear).getFullYear() : 'N/A'}. Kindly confirm and settle the bill at your earliest convenience.</em></p>

                ${tableHTML}

 <div class="total">
                    <p><strong>Total Amount:</strong> ₹${parseFloat(totalAmount).toFixed(2)} (${totalAmountWords})</p> <!-- Display total amount in numbers and words -->
                </div>

              <div class="footer">
                    <p>Thank you,</p>
                    <p>Yours faithfully,</p>
                    <p><strong>MBS Lorry Service Reg</strong></p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
}


// Function to convert numbers to words
function numberToWords(num) {
    const units = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    const thousands = [
        '', 'Thousand'
    ];

    if (num === 0) return 'Zero';

    let words = '';
    let currentNum = Math.floor(num);
    
    if (currentNum >= 1000) {
        words += units[Math.floor(currentNum / 1000)] + ' ' + thousands[1] + ' ';
        currentNum %= 1000;
    }
    
    if (currentNum >= 100) {
        words += units[Math.floor(currentNum / 100)] + ' Hundred ';
        currentNum %= 100;
    }
    
    if (currentNum >= 20) {
        words += tens[Math.floor(currentNum / 10)] + ' ';
        currentNum %= 10;
    }
    
    if (currentNum > 0) {
        words += units[currentNum] + ' ';
    }

    return words.trim();
}

function updateTotal(lrNo, newPrice) {
    // Update the total amount in your data source
    console.log(`Updated LR No: ${lrNo}, New Price: ${newPrice}`);
    // Implement the logic to save the new price if necessary
}