let receipts = [];

// Load receipts from localStorage when the page loads
window.onload = function () {
    const storedReceipts = localStorage.getItem('receipts');
    if (storedReceipts) {
        receipts = JSON.parse(storedReceipts); // Parse the stored JSON string
        updateReceiptTable(); // Populate the table with saved receipts
    }
};

function saveReceipt() {
    const slipNumber = document.getElementById('slipNumber').value;
    const date = document.getElementById('date').value;
    const from = document.getElementById('from').value; // New "From" field
    const to = document.getElementById('to').value; // New "To" field
    const consigneeName = document.getElementById('consigneeName').value;
    const paymentType = document.getElementById('paymentType').value;
    const amount = document.getElementById('amount').value;

    // Add receipt data to receipts array
    const receipt = { slipNumber, date, consigneeName, paymentType, amount };
    receipts.push(receipt);

    // Save the updated receipts array to localStorage
    localStorage.setItem('receipts', JSON.stringify(receipts));

    // Clear the input fields
    document.getElementById('receiptForm').reset();

    // Update table with saved receipts
    updateReceiptTable();
}

function updateReceiptTable() {
    const receiptBody = document.getElementById('receiptBody');
    receiptBody.innerHTML = ''; // Clear table before adding new rows

    receipts.forEach((receipt, index) => {
        const row = `<tr>
            <td>${receipt.slipNumber}</td>
            <td>${receipt.date}</td>
             <td>${receipt.from}</td> <!-- New "From" field -->
            <td>${receipt.to}</td> <!-- New "To" field -->
            <td>${receipt.consigneeName}</td>
            <td>${receipt.paymentType}</td>
            <td>${receipt.amount}</td>
            <td><button onclick="removeReceipt(${index})">Remove</button></td>
        </tr>`;
        receiptBody.innerHTML += row;
    });
}

function removeReceipt(index) {
    receipts.splice(index, 1); // Remove the selected receipt from the array

    // Save the updated receipts array to localStorage
    localStorage.setItem('receipts', JSON.stringify(receipts));

    updateReceiptTable(); // Update the table to reflect changes
}

function printReceipts() {
    const printContent = document.querySelector('.container').innerHTML;
    const originalContent = document.body.innerHTML;

    // Replace current body with table for print
    document.body.innerHTML = printContent;

    window.print();

    // Restore original content after print
    document.body.innerHTML = originalContent;

    // Re-add event listeners after printing
    document.querySelector('script').src = 'script.js';
}

function exportReceipts() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Slip Number,Date,From,To,Consignee Name,Payment Type,Amount\n"; // Updated CSV header


    receipts.forEach(receipt => {
        csvContent += `${receipt.slipNumber},${receipt.date},${receipt.from},${receipt.to},${receipt.consigneeName},${receipt.paymentType},${receipt.amount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "receipts.csv");
    document.body.appendChild(link); // Required for Firefox

    link.click();
}
