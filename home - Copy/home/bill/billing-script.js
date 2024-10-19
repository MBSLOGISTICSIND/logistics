// Function to calculate and generate the bill
function generateBill() {
    // Get values from the form
    const lrNo = document.getElementById('lr-no').value;
    const manualBillNo = document.getElementById('manual-bill-no').value;
    const customerName = document.getElementById('customer-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const quantity = document.getElementById('quantity').value;
    const rate = document.getElementById('rate').value;
    const total = quantity * rate;

    // Display the calculated total in the form
    document.getElementById('total').value = total;

    // Show values in the bill preview
    document.getElementById('preview-lr-no').textContent = lrNo;
    document.getElementById('preview-bill-no').textContent = manualBillNo;
    document.getElementById('preview-customer-name').textContent = customerName;
    document.getElementById('preview-item-desc').textContent = itemDescription;
    document.getElementById('preview-quantity').textContent = quantity;
    document.getElementById('preview-rate').textContent = rate;
    document.getElementById('preview-total').textContent = total;

    // Show the bill preview section
    document.getElementById('bill-preview').style.display = 'block';
}

// Function to print the bill
function printBill() {
    generateBill(); // Ensure the latest bill is generated
    window.print(); // Trigger print dialog
}
