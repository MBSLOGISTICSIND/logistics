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


function calculateRowTotal(input) {
    const row = input.closest('tr');
    const noOfArticles = parseFloat(row.querySelector('.no-articles').value) || 0;
    const ratePerArticle = parseFloat(row.querySelector('.rate-per-article').value) || 0;
    const gstRate = parseFloat(row.querySelector('.gst').value) || 0;
    const freight = parseFloat(row.querySelector('.freight').value) || 0;

    // Validate input values and reset the row if invalid
    if (!noOfArticles || !ratePerArticle || noOfArticles < 0 || ratePerArticle < 0) {
        row.querySelector('.gst-amt').value = '0.00';
        row.querySelector('.total').value = '0.00';
        return;
    }

    // Ensure noOfArticles and ratePerArticle are positive values
    if (noOfArticles > 0 && ratePerArticle > 0) { 
        const gstAmount = (noOfArticles * ratePerArticle * gstRate) / 100;
        const totalAmount = (noOfArticles * ratePerArticle) + gstAmount + freight;

        row.querySelector('.gst-amt').value = gstAmount.toFixed(2);
        row.querySelector('.total').value = totalAmount.toFixed(2);

        calculateGrandTotal(); // Update grand total after calculating the row total
    } else {
        // Reset values if inputs are not valid
        row.querySelector('.gst-amt').value = '';
        row.querySelector('.total').value = '';
    }
}


// Function to calculate the grand total
function calculateGrandTotal() {
    const totalElements = document.querySelectorAll('.total');
    let grandTotal = 0;

    totalElements.forEach(element => {
        grandTotal += parseFloat(element.value) || 0;
    });

    document.getElementById('total-amount').value = grandTotal.toFixed(2);
}

// Attach event listeners for other inputs to calculate totals
document.addEventListener('input', function (event) {
    if (event.target.matches('.no-articles, .rate-per-article, .freight, .gst')) {
        calculateRowTotal(event.target);
    }
});


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
    // Update bill preview with the values from the form
    document.getElementById("preview-from").innerText = document.getElementById("from").value;
    document.getElementById("preview-to").innerText = document.getElementById("to").value;
    document.getElementById("preview-consignor").innerText = document.getElementById("consigner").value;
    document.getElementById("preview-consignee").innerText = document.getElementById("consignee").value;
    document.getElementById("preview-consignee-address").innerText = document.getElementById("consignee-address").value;
    document.getElementById("preview-consignor-address").innerText = document.getElementById("consigner-address").value;
    document.getElementById("preview-date").innerText = document.getElementById("date").value;
    document.getElementById("preview-lr-no").innerText = document.getElementById("lr-no").value;

    // Update total amounts
    const goodsEntries = document.querySelectorAll('#goods-entries tr');
    const previewEntries = document.getElementById('preview-entries');
    previewEntries.innerHTML = ''; // Clear previous entries
    let grandTotal = 0;

    goodsEntries.forEach((entry) => {
        const goodsId = parseInt(entry.querySelector('.goods').value);
        const selectedGood = goodsList.find(good => good.id === goodsId); // Get the goods object by its ID
        const noArticles = entry.querySelector('.no-articles').value || 0;
        const ratePerArticle = entry.querySelector('.rate-per-article').value || 0;
        const gstAmount = entry.querySelector('.gst-amt').value || 0;
        const freight = entry.querySelector('.freight').value || 0;
        const total = entry.querySelector('.total').value || 0;

        if (selectedGood) { // Only add to preview if a valid good is selected
            const newRow = `
                <tr>
                    <td style="border: 1px solid black; padding: 8px;">${selectedGood.name}</td> <!-- Use goods name -->
                    <td style="border: 1px solid black; padding: 8px;">${noArticles}</td>
                    <td style="border: 1px solid black; padding: 8px;">${ratePerArticle}</td>
                    <td style="border: 1px solid black; padding: 8px;">${entry.querySelector('.gst').value}</td>
                    <td style="border: 1px solid black; padding: 8px;">${gstAmount}</td>
                    <td style="border: 1px solid black; padding: 8px;">${freight}</td>
                    <td style="border: 1px solid black; padding: 8px;">${total}</td>
                </tr>
            `;
            previewEntries.insertAdjacentHTML('beforeend', newRow);
            grandTotal += parseFloat(total);
        }
    });

    // Update total amounts in the preview
    document.getElementById("preview-gst-amt").innerText = document.getElementById("gst-amt").value;
    document.getElementById("preview-total").innerText = grandTotal.toFixed(2);

    document.getElementById("bill-preview").style.display = 'block'; // Show the bill preview
}


//<!-- From and To Section -->

const fromList = ["Bengaluru", "Yeshwanthpur", "OT Pet"];
const toList = ["KGF", "Bangarpet", "Kolar"];


//<!-- Consignor and Consignee Section -->

const consignersList = ["Raghu", "Aggarwal", "Consigner 3"];
const consigneesList = ["Consignee 1", "Consignee 2", "Consignee 3"];

// Function to populate Consignors and Consignees
function populateSelectOptions(selectElementId, optionsArray) {
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '<option value="">Select ' + selectElementId + '</option>';
    optionsArray.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option;
        newOption.textContent = option;
        selectElement.appendChild(newOption);
    });
}

// Call the function to populate the select elements on page load
populateSelectOptions('consigner', consignersList);
populateSelectOptions('consignee', consigneesList);
populateSelectOptions('from', fromList);
populateSelectOptions('to', toList);

function addNewOption(selectId) {
    const selectElement = document.getElementById(selectId);
    const newOptionValue = prompt("Enter new " + selectId);
    
    if (newOptionValue) {
        const newOption = document.createElement('option');
        newOption.value = newOptionValue;
        newOption.textContent = newOptionValue;
        selectElement.appendChild(newOption);
    }
}


function removeOption(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.options[selectElement.selectedIndex].remove();
}



//<!-- Goods Info Section -->

const goodsList = [
    { id: 1, name: "Box", gst: 5 },
    { id: 2, name: "Big Box", gst: 5 },
    { id: 3, name: "Bag", gst: 5 },
    { id: 4, name: "BigBag", gst: 5 },
    // Add more items as needed
];

// Function to populate the goods dropdown
function populateGoodsDropdown(selectElement) {
    selectElement.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Goods';
    selectElement.appendChild(defaultOption);

    goodsList.forEach(good => {
        const option = document.createElement('option');
        option.value = good.id; // Use the item's id as the value
        option.textContent = good.name; // Use the item's name as the text
        selectElement.appendChild(option);
    });

    // Add onchange event listener to recalculate when a new good is selected
    selectElement.addEventListener('change', function() {
        const selectedGood = goodsList.find(good => good.id === parseInt(selectElement.value));
        const gstInput = selectElement.closest('tr').querySelector('.gst');
        gstInput.value = selectedGood ? selectedGood.gst : 0; // Set GST based on selected good

        calculateRowTotal(selectElement); // Call the calculate function for the current row
    });
}

// Function to add a goods entry
function addGoodsEntry() {
    const goodsEntries = document.getElementById("goods-entries");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>
            <select class="goods" required>
                <!-- Options will be populated by JavaScript -->
            </select>
        </td>
        <td><input type="number" class="no-articles" required></td>
        <td><input type="number" class="rate-per-article" required></td>
        <td>
            <select class="gst" required>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
            </select>
        </td>
        <td><input type="number" class="gst-amt" readonly></td>
        <td><input type="number" class="freight" required></td>
        <td><input type="number" class="total" readonly></td>
        <td><button type="button" onclick="removeGoodsEntry(this)">Remove</button></td>
    `;



    goodsEntries.appendChild(newRow);


    // Populate the new goods dropdown
    const goodsSelect = newRow.querySelector('.goods');
    populateGoodsDropdown(goodsSelect);

    newRow.querySelectorAll('.no-articles, .rate-per-article, .gst, .freight').forEach(input => {
        input.addEventListener('input', () => calculateRowTotal(input));
    });
}

  // Function to remove a goods entry
function removeGoodsEntry(button) {
    const row = button.closest('tr');
    row.remove();
    calculateGrandTotal();
}

// Call this function when the page loads to populate any existing rows
window.onload = function() {
    const goodsSelects = document.querySelectorAll('.goods');
    goodsSelects.forEach(select => {
        populateGoodsDropdown(select);
    });
}





// Function to print the bill preview
function printBill() {
    const printContents = document.getElementById("bill-preview").innerHTML;
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write('<html><head><title>Print Bill</title></head><body>');
    newWindow.document.write(printContents);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
}


async function saveBill() {
    const billData = {
        lr_no: document.getElementById('lr_no').value,
        manual_bill_no: document.getElementById('manual_bill_no').value,
        // Add other fields as necessary
    };

    try {
        // Make an API call to save the bill
        const response = await fetch('/api/save-bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        });
        if (!response.ok) {
            throw new Error('Failed to save the bill');
        }
        alert('Bill saved successfully!');
    } catch (error) {
        console.error('Error saving bill:', error);
        alert('Failed to save the bill. Please check your network connection or try again later.');
    }
}




// Function to modify the bill (simulation)
function modifyBill() {
    alert("Modify Bill functionality not implemented yet.");
    // Implement modify logic

    async function fetchReportData() {
        try {
            const response = await fetch('http://localhost:3000/api/bills');
            const bills = await response.json();
    
            // Get the reports section and clear previous content
            const reportsSection = document.getElementById("reports-section");
            reportsSection.innerHTML = "";
    
            // Iterate through each bill and create HTML elements to display the data
            bills.forEach((bill, index) => {
                const billRow = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${bill.lrNo}</td>
                        <td>${bill.billNo}</td>
                        <td>${bill.customerName}</td>
                        <td>${bill.totalAmount}</td>
                        <td>${bill.date}</td>
                        <td>${bill.time}</td>
                    </tr>
                `;
                reportsSection.innerHTML += billRow;
            });
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    }
    
    // Call the fetchReportData function on page load or after saving a bill
    fetchReportData();


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
    document.getElementById("bill-preview").style.display = 'none'; // Hide the bill preview
}

// Other existing functions remain unchanged

