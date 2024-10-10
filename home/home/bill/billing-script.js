// Function to calculate GST and total amount
function calculateTotal() {
    // Get the values from the input fields
    const ratePerArticle = parseFloat(document.getElementById("rate-per-article").value) || 0;
    const gstPercentage = parseFloat(document.getElementById("gst").value) || 0;
    const freight = parseFloat(document.getElementById("freight").value) || 0;
    const noOfArticles = parseFloat(document.getElementById("no-articles").value) || 0;

    // Calculate subtotal (the total cost of articles without GST)
    const subtotal = ratePerArticle * noOfArticles;

    // Calculate GST amount based on the subtotal and the GST percentage
    const gstAmount = (subtotal * gstPercentage) / 100; // GST Calculation

    // Calculate total amount (subtotal + GST + freight)
    const totalAmount = subtotal + gstAmount + freight; // Total Calculation

    // Set values to the respective input fields
    document.getElementById("gst-amt").value = gstAmount.toFixed(2); // Show GST amount
    document.getElementById("total").value = totalAmount.toFixed(2); // Show total amount
}

// Function to add a new option
function addNewOption(selectId) {
    const select = document.getElementById(selectId);
    const newValue = prompt("Enter new value:");
    if (newValue) {
        const option = document.createElement("option");
        option.value = newValue;
        option.text = newValue;
        select.add(option);
    }
}

// Function to remove the selected option
function removeOption(selectId) {
    const select = document.getElementById(selectId);
    const selectedIndex = select.selectedIndex;
    if (selectedIndex > -1) {
        select.remove(selectedIndex);
    }
}

// Function to generate the bill preview
function generateBill() {
    // Fetch form inputs
    const lrNo = document.getElementById('lr-no').value;
    const manualBillNo = document.getElementById('manual-bill-no').value;
    const billNo = document.getElementById('bill-no').value;
    const customerName = document.getElementById('customer-name').value;
    const fromLocation = document.getElementById('from').value;
    const toLocation = document.getElementById('to').value;
    const consignor = document.getElementById('consigner').value;
    const consignee = document.getElementById('consignee').value;
    const goods = document.getElementById('goods').value;
    const noOfArticles = document.getElementById('no-articles').value;
    const ratePerArticle = document.getElementById('rate-per-article').value;
    const gstAmt = document.getElementById('gst-amt').value;
    const freight = document.getElementById('freight').value;
    const totalAmount = document.getElementById('total').value;
    const date = document.getElementById('date').value;

    // Populate the preview section
    document.getElementById('preview-lr-no').textContent = lrNo;
    document.getElementById('preview-bill-no').textContent = billNo;
    document.getElementById('preview-from').textContent = fromLocation;
    document.getElementById('preview-to').textContent = toLocation;
    document.getElementById('preview-consignor').textContent = consignor;
    document.getElementById('preview-consignee').textContent = consignee;
    document.getElementById('preview-goods').textContent = goods;
    document.getElementById('preview-no-articles').textContent = noOfArticles;
    document.getElementById('preview-rate-per-article').textContent = ratePerArticle;
    document.getElementById('preview-gst-amt').textContent = gstAmt;
    document.getElementById('preview-total').textContent = totalAmount;
    document.getElementById('preview-date').textContent = date;
}

function printBill() {
    generateBill();  // Ensure the details are populated
    window.print();
}

function saveBill() {
    generateBill();  // Ensure the details are populated before saving
    alert('Bill saved successfully!');
    // Code to save the bill data can be added here (e.g., sending data to the backend)
}

function calculateTotal() {
    const noOfArticles = parseFloat(document.getElementById('no-articles').value) || 0;
    const ratePerArticle = parseFloat(document.getElementById('rate-per-article').value) || 0;
    const gstPercent = parseFloat(document.getElementById('gst').value) || 0;
    const freight = parseFloat(document.getElementById('freight').value) || 0;

    // Calculate the total before GST
    const totalBeforeGST = noOfArticles * ratePerArticle;
    
    // Calculate GST Amount
    const gstAmt = (totalBeforeGST * gstPercent) / 100;
    
    // Set GST Amount
    document.getElementById('gst-amt').value = gstAmt.toFixed(2);

    // Calculate the total including GST and freight
    const total = totalBeforeGST + gstAmt + freight;
    document.getElementById('total').value = total.toFixed(2);
}

function addNewOption(selectId) {
    const selectElement = document.getElementById(selectId);
    const newOption = prompt(`Enter new value for ${selectId}`);
    if (newOption) {
        const option = document.createElement('option');
        option.text = newOption;
        selectElement.add(option);
    }
}

function removeOption(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.remove(selectElement.selectedIndex);
}


// Function to modify the bill (simulation)
function modifyBill() {
    alert("Modify Bill functionality not implemented yet.");
    // Implement modify logic
}

// Function to delete the bill (simulation)
function deleteBill() {
    alert("Delete Bill functionality not implemented yet.");
    // Implement delete logic
}

// Function to close the form
function closeForm() {
    document.getElementById("billing-form").reset();
    document.getElementById("goods-form").reset();
    document.getElementById("billing-details-form").reset();
    document.getElementById("bill-preview").style.display = 'none';
}
