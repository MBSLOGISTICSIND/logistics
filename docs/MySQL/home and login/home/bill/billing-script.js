// Function to generate a new LR number based on the last saved bill
function generateLRNo() {
    // Retrieve saved bills from localStorage
    const bills = JSON.parse(localStorage.getItem('bills')) || [];

    // If there are saved bills, get the last LR number
    let lastLRNo = '0000'; // Default to '0000' if no bills exist
    if (bills.length > 0) {
        // Get the LR number of the last saved bill
        lastLRNo = bills[bills.length - 1].lrNo;
    }

    // Increment the last LR number by 1 and pad with zeros up to 4 digits
    let newLRNo = (parseInt(lastLRNo) + 1).toString().padStart(4, '0');

    // Update the input field with the new LR number
    document.getElementById('lr-no').value = newLRNo;

    // Store the new LR number in localStorage for future use
    localStorage.setItem('lastLRNo', newLRNo);
}


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
    document.getElementById("preview-gst-amt").value = gstAmount.toFixed(2); // Show GST amount
    document.getElementById("preview-total").value = totalAmount.toFixed(2); // Show total amount
}

function calculateRowTotal(input) {
    const row = input.closest('tr');
    const noOfArticles = parseFloat(row.querySelector('.no-articles').value) || 0;
    const ratePerArticle = parseFloat(row.querySelector('.rate-per-article').value) || 0;
    const gstRate = parseFloat(row.querySelector('.gst').value) || 0;
    const freight = parseFloat(row.querySelector('.freight').value) || 0;

    // Validate input values and reset the row if invalid
    if (noOfArticles <= 0 || ratePerArticle <= 0) {
        row.querySelector('.gst-amt').value = '';
        row.querySelector('.total').value = '';
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

    // Update the preview total for grand total
    document.getElementById('total-amount').value = grandTotal.toFixed(2);
    document.getElementById("preview-total").innerText = grandTotal.toFixed(2); // Update displayed grand total
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
    document.getElementById("preview-Consignee-Invoice-no").innerText = document.getElementById("Consignee-Invoice-no").value;
    document.getElementById("preview-consigner-gst").innerText = document.getElementById("consigner-gst").value;
    document.getElementById("preview-consignee-gst").innerText = document.getElementById("consignee-gst").value;

    // Generate the goods entries for the preview table
    updateBillPreview();
    
    // Show the bill preview
    document.getElementById("bill-preview").style.display = 'block';
}

function updateBillPreview() {
    // Get the goods table and the bill preview table body
    const goodsTableBody = document.getElementById("goods-entries");
    const billPreviewBody = document.querySelector(".bill-table tbody");

    // Clear existing rows in the Bill Preview table
    billPreviewBody.innerHTML = "";

    // Variables to store concatenated values for all goods entries with line breaks
    let goodsNames = '';
    let noOfArticles = '';
    let ratesPerArticle = '';
    let totalAmounts = '';

    // Loop through each row in the Goods Info table and concatenate data with line breaks
    const goodsRows = goodsTableBody.querySelectorAll("tr");
    goodsRows.forEach((row, index) => {
        // Get the selected text of the dropdown option for goods name
        const goodsNameDropdown = row.querySelector(".goods");
        const goodsName = goodsNameDropdown.options[goodsNameDropdown.selectedIndex].text;

        const noArticles = row.querySelector(".no-articles").value;
        const ratePerArticle = row.querySelector(".rate-per-article").value;
        const totalAmount = row.querySelector(".total").value;

        // Append each value to the corresponding concatenated string with a line break after each entry
        goodsNames += goodsName + "<br>";
        noOfArticles += noArticles + "<br>";
        ratesPerArticle += ratePerArticle + "<br>";
        totalAmounts += totalAmount + "<br>";
    });

    // Get the entered DD/C and DC/C amounts
    const ddCAmount = parseFloat(document.getElementById("ddc-amount").value) || 0;
    const dcCAmount = parseFloat(document.getElementById("dcc-amount").value) || 0;

    // Create a single row in the Bill Preview table with entries stacked vertically
    const billRow = document.createElement("tr");
    billRow.innerHTML = `
        <td style="border: 1px solid black; padding: 8px;">1</td>
        <td style="border: 1px solid black; padding: 8px;">${goodsNames}</td>
        <td style="border: 1px solid black; padding: 8px;">${noOfArticles}</td>
        <td style="border: 1px solid black; padding: 8px;">${ratesPerArticle}</td>
        <td style="border: 1px solid black; padding: 8px;">${totalAmounts}</td>
        <td style="border: 1px solid black; padding: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="border: 1px solid black; padding: 4px;">DD/C</td><td style="border: 1px solid black; padding: 4px;" id="dd-c">${ddCAmount.toFixed(2)}</td></tr>
                <tr><td style="border: 1px solid black; padding: 4px;">DC/C</td><td style="border: 1px solid black; padding: 4px;" id="dc-c">${dcCAmount.toFixed(2)}</td></tr>
                <tr><td style="border: 1px solid black; padding: 4px;">GST 5%</td><td style="border: 1px solid black; padding: 4px;" id="gst-5">0.00</td></tr>
            </table>
        </td>
    `;

    // Add the single row with stacked entries to the Bill Preview table
    billPreviewBody.appendChild(billRow);

    // Calculate and update the total amount for all goods
    updateTotalAmount();
}

// Function to calculate the total amount from all goods and add GST 5% (Excluding DD/C and DC/C)
function updateTotalAmount() {
    const goodsRows = document.querySelectorAll(".total");
    let goodsTotalAmount = 0;
    
    // Sum up all the goods' total amounts (Exclude DD/C and DC/C for GST calculation)
    goodsRows.forEach(row => {
        goodsTotalAmount += parseFloat(row.value) || 0;
    });

    // Calculate GST 5% based on the total amount of goods only
    const gst5 = goodsTotalAmount * 0.05; // 5% GST

    // Update the GST 5% field in the bill preview
    document.getElementById("gst-5").innerText = gst5.toFixed(2);

    // Now calculate the final total by adding DD/C and DC/C, but excluding them from the GST calculation
    const ddC = parseFloat(document.getElementById("dd-c").innerText) || 0;
    const dcC = parseFloat(document.getElementById("dc-c").innerText) || 0;

    let finalTotal = goodsTotalAmount + gst5 + ddC + dcC;

    // Update the displayed final total amount (Total + DD/C + DC/C + GST)
    document.getElementById("total-amount").innerText = finalTotal.toFixed(2);
}

    // Show the bill preview section
    document.getElementById("bill-preview").style.display = 'block';


    // Initialize data
    const fromList = JSON.parse(localStorage.getItem("fromList")) || ["Bengaluru", "Yeshwanthpur", "OT Pet"];
    const toList = JSON.parse(localStorage.getItem("toList")) || ["KGF", "Bangarpet", "Kolar"];
    let consignersData = JSON.parse(localStorage.getItem("consignersData")) || [];
    let consigneesData = JSON.parse(localStorage.getItem("consigneesData")) || [];
    
    // Function to populate select options
    function populateSelectOptions(selectElementId, optionsArray) {
        const selectElement = document.getElementById(selectElementId);
        selectElement.innerHTML = '<option value="">Select ' + selectElementId + '</option>';
        optionsArray.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option.name;
            newOption.textContent = option.name;
            selectElement.appendChild(newOption);
        });
    }
    
    // Populate selects on load
    populateSelectOptions('from', fromList.map(name => ({ name })));
    populateSelectOptions('to', toList.map(name => ({ name })));
    populateSelectOptions('consigner', consignersData);
    populateSelectOptions('consignee', consigneesData);
    
    // Function to save new options to localStorage (example)
    function saveNewFromTo(fromValue, toValue) {
        // Add the new values to the respective lists
        if (fromValue && !fromList.includes(fromValue)) {
            fromList.push(fromValue);
            localStorage.setItem("fromList", JSON.stringify(fromList)); // Save to localStorage
        }
    
        if (toValue && !toList.includes(toValue)) {
            toList.push(toValue);
            localStorage.setItem("toList", JSON.stringify(toList)); // Save to localStorage
        }
    }
    
    function populateConsignorDetails() {
        const consignerSelect = document.getElementById('consigner');
        const selectedName = consignerSelect.value;
        const selectedConsignor = consignersData.find(consignor => consignor.name === selectedName);
        
        if (selectedConsignor) {
            document.getElementById('consigner-address').value = selectedConsignor.address;
            document.getElementById('consigner-gst').value = selectedConsignor.gstNo;
        } else {
            document.getElementById('consigner-address').value = '';
            document.getElementById('consigner-gst').value = '';
        }
    }
    
    function populateConsigneeDetails() {
        const consigneeSelect = document.getElementById('consignee');
        const selectedName = consigneeSelect.value;
        const selectedConsignee = consigneesData.find(consignee => consignee.name === selectedName);
    
        if (selectedConsignee) {
            document.getElementById('consignee-address').value = selectedConsignee.address;
            document.getElementById('consignee-gst').value = selectedConsignee.gstNo;
        } else {
            document.getElementById('consignee-address').value = '';
            document.getElementById('consignee-gst').value = '';
        }
    }
    
    function openModal(type) {
        document.getElementById('modal-title').innerText = `Add New ${type}`;
        document.getElementById('modal-save').onclick = function() {
            saveData(type);
        };
        document.getElementById('modal').style.display = 'block';
    }
    
    // Ensure the viewModal opens correctly
    function openViewModal() {
        displayData(); // Populate the table with data before opening
        document.getElementById('viewModal').style.display = 'block';
    }
    
    function closeViewModal() {
        document.getElementById('viewModal').style.display = 'none';
    }
    
    function saveData(type) {
        const name = document.getElementById('modal-name').value;
        const address = document.getElementById('modal-address').value;
        const gstNo = document.getElementById('modal-gst').value;
    
        if (name && address && gstNo) {
            const newData = { name, address, gstNo };
    
            if (type === 'Consignor') {
                consignersData.push(newData);
                localStorage.setItem('consignersData', JSON.stringify(consignersData));
                populateSelectOptions('consigner', consignersData);
            } else if (type === 'Consignee') {
                consigneesData.push(newData);
                localStorage.setItem('consigneesData', JSON.stringify(consigneesData));
                populateSelectOptions('consignee', consigneesData);
            }
            closeModal();
        } else {
            alert("Please fill in all fields");
        }
    }
    
    // Function to display saved data in the view modal
    function displayData() {
        const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear the table body
    
        // Combine consigners and consignees data for display
        const savedData = [...consignersData, ...consigneesData];
    
        // Populate the table with saved data
        savedData.forEach((data, index) => { // Pass the index for each data entry
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = data.name;
            row.insertCell(1).innerText = data.address;
            row.insertCell(2).innerText = data.gstNo; // Ensure correct property name
    
            // Add a delete button in the last cell
            const deleteCell = row.insertCell(3);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function () {
                deleteData(index); // Pass the correct index to delete function
            };
            deleteCell.appendChild(deleteBtn);
        });
    }
    
    // Function to delete data by index
    function deleteData(index) {
        // Check if the index is in consignersData or consigneesData and delete the appropriate entry
        if (index < consignersData.length) {
            // Remove from consigners and update both localStorage and in-memory array
            consignersData.splice(index, 1); 
            localStorage.setItem('consignersData', JSON.stringify(consignersData)); // Update local storage
        } else {
            // Remove from consignees and update both localStorage and in-memory array
            consigneesData.splice(index - consignersData.length, 1); 
            localStorage.setItem('consigneesData', JSON.stringify(consigneesData)); // Update local storage
        }
    
        // Immediately refresh the displayed data after deletion
        displayData();
    }
    
    
    // Event listener for closing modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        const viewModal = document.getElementById('viewModal');
        if (event.target == modal) {
            closeModal();
        } else if (event.target == viewModal) {
            closeViewModal();
        }
    }
    
    function closeModal() {
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-address').value = '';
        document.getElementById('modal-gst').value = '';
        document.getElementById('modal').style.display = 'none';
    }
    
    
    function removeOption(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.selectedIndex = 0; // Reset to default option
        if (selectId === 'consigner') {
            document.getElementById('consigner-address').value = '';
            document.getElementById('consigner-gst').value = '';
        } else {
            document.getElementById('consignee-address').value = '';
            document.getElementById('consignee-gst').value = '';
        }
    }

// Define the list of goods
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

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Goods';
    selectElement.appendChild(defaultOption);

    // Populate options from goodsList
    goodsList.forEach(good => {
        const option = document.createElement('option');
        option.value = good.id; // Use the item's id as the value
        option.textContent = good.name; // Use the item's name as the text
        selectElement.appendChild(option);
    });

    // Handle the change event to update GST and recalculate totals
    selectElement.addEventListener('change', function() {
        const selectedGood = goodsList.find(good => good.id === parseInt(selectElement.value));
        const gstInput = selectElement.closest('tr').querySelector('.gst');
        gstInput.value = selectedGood ? selectedGood.gst : 0; // Set GST based on the selected good

        calculateRowTotal(selectElement); // Call the calculate function for the current row
    });
}

// Function to initialize the first goods entry row on page load
function initializeFirstRow() {
    addGoodsEntry(); // This automatically adds the first row and populates the dropdown
}


// Function to add a goods entry row
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

    // Attach event listeners for recalculating totals
    newRow.querySelectorAll('.no-articles, .rate-per-article, .gst, .freight').forEach(input => {
        input.addEventListener('input', () => calculateRowTotal(input));
    });
}

// Function to remove a goods entry
function removeGoodsEntry(button) {
    const row = button.closest('tr');
    row.remove();
    calculateGrandTotal(); // Recalculate grand total when a row is removed
}


// Call the function to initialize on page load
window.onload = function() {
    initializeFirstRow(); // Initialize the first row on load
};

// Function to print the bill preview
function printBill() {
    const printContents = document.getElementById("bill-preview").innerHTML;
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write('<html><head><title>Print Bill</title></head><body>');
    newWindow.document.write(printContents);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();

     // First save the bill to the server
     saveBillToServer(bill)
     .then(() => {
         // Only proceed with printing if save was successful
         const printContents = document.getElementById("bill-preview").innerHTML;
         const newWindow = window.open('', '', 'width=600,height=400');

         newWindow.document.write(`
             <html>
                 <head>
                     <title>Print Bill</title>
                     <style>
                         @media print {
                             body { margin: 0; }
                             .company-details { width: 100%; border-collapse: collapse; }
                             .company-details td { padding: 10px; border: 1px solid black; }
                         }
                         body { font-family: Arial, sans-serif; font-size: 12px; }
                     </style>
                 </head>
                 <body>${printContents}</body>
             </html>
         `);

         newWindow.document.close();
         newWindow.print(); // Trigger the print dialog
     })
     .catch(error => {
         // Show an alert if saving failed
         alert("Failed to save bill. Please try again.");
         console.error("Error saving and printing bill:", error);
     });
}


function saveBill() {
    console.log("Save Bill function called"); // Debugging line
    try {
        // Get form values
        const lrNo = document.getElementById('lr-no').value;
        const date = document.getElementById('date').value;
        const gstPaidBy = document.getElementById('gst-paid-by').value;
        const paymentMode = document.getElementById('payment-mode').value;
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const consignor = document.getElementById('consigner').value;
        const consignorAddress = document.getElementById('consigner-address').value;
        const consignee = document.getElementById('consignee').value;
        const consigneeAddress = document.getElementById('consignee-address').value;
        const consigneeInvoiceNo = document.getElementById('Consignee-Invoice-no').value;

        // Log values for debugging
        console.log("From Location: ", from);
        console.log("To Location: ", to);

        // Validate required fields
        if (!from || !to) {
            console.error("From and To locations must not be empty.");
            return; // Prevent saving the bill
        }

        // Get goods info
        const goodsEntries = [];
        const rows = document.querySelectorAll("#goods-entries tr");
        rows.forEach((row) => {
            const goodsNameDropdown = row.querySelector(".goods");
            const goodsName = goodsNameDropdown.options[goodsNameDropdown.selectedIndex].text;
            const noOfArticles = row.querySelector(".no-articles").value;
            const ratePerArticle = row.querySelector(".rate-per-article").value;
            const totalAmount = row.querySelector(".total").value;

            goodsEntries.push({
                goods: goodsName,
                noOfArticles,
                ratePerArticle,
                total: parseFloat(totalAmount) || 0  // Ensure total is a number
            });
        });

        // Call updateTotalAmount to ensure the total is calculated
        updateTotalAmount();

        // Get the final total amount after GST and DD/C/DC/C calculations
        const finalTotalAmount = parseFloat(document.getElementById("total-amount").innerText) || 0;

        // Create bill object
        const bill = {
            lrNo,
            date,
            gstPaidBy,
            paymentMode,
            from,
            to,
            consignor,
            consignorAddress,  // Added consignor address
            consignee,
            consigneeAddress,  // Added consignee address
            consigneeInvoiceNo, // Added consignee invoice number
            total: finalTotalAmount, // Use the final total amount here
            goodsEntries // Save the goods entries in the bill
        };

        // Retrieve saved bills from localStorage
        const bills = JSON.parse(localStorage.getItem('bills')) || [];

        // Check if editing an existing bill
        const editIndex = localStorage.getItem("editBillIndex");
        if (editIndex !== null) {
            const index = parseInt(editIndex, 10);
            // Update the existing bill at the given index
            bills[index] = bill;
            alert("Bill updated successfully!");

            // Update the server data
            saveBillToServer(bill);
            localStorage.removeItem("editBillIndex");
        } else {
            // New bill
            bills.push(bill);
            alert("Bill saved successfully!");
            saveBillToServer(bill); // Save to server on new bill
        }

        // Save the updated bills array back to localStorage
        localStorage.setItem('bills', JSON.stringify(bills));
        console.log("Bills saved to localStorage:", bills); // Debugging line

        // Optionally load reports right after saving (if you're still on the same page)
        loadReports();
    } catch (error) {
        alert("Error saving bill: " + error.message);
    }
}



// Function to save bill to server
function saveBillToServer(bill) {
    const url = bill.id ? `https://logistics-87vc.onrender.com/api/update-bill/${bill.id}` : 'https://logistics-87vc.onrender.com/api/save-bill'; // Dynamic URL
    const method = bill.id ? 'PUT' : 'POST';  // Use PUT for updating and POST for new bills

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bill)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Error ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Bill saved to server:", data);
        // Optionally, update local storage with the server's response if needed
        loadReports(); // Reload reports after saving
    })
    .catch(error => {
        console.error("Error saving bill to server:", error);
    });
}

// Function to load bill from server
function loadBillFromServer(billId) {
    fetch(`https://logistics-87vc.onrender.com/api/get-bill/${billId}`)
        .then(response => response.json())
        .then(bill => {
            populateBillForm(bill);
            localStorage.setItem("editBillIndex", bill.id);
        })
        .catch(error => {
            console.error("Error loading bill from server:", error);
        });
}

function editBill(billId) {
    loadBillFromServer(billId);  // Load data from server and populate the form
    // Optionally redirect to the billing form page if required
}

function populateBillForm(bill) {
    // Populate the form fields with bill details
    document.getElementById('lr-no').value = bill.lrNo;
    document.getElementById('date').value = bill.date;
    document.getElementById('gst-paid-by').value = bill.gstPaidBy;
    document.getElementById('payment-mode').value = bill.paymentMode;
    document.getElementById('from').value = bill.from;
    document.getElementById('to').value = bill.to;
    document.getElementById('consigner').value = bill.consignor;
    document.getElementById('consigner-address').value = bill.consignorAddress;
    document.getElementById('consignee').value = bill.consignee;
    document.getElementById('consignee-address').value = bill.consigneeAddress;
    document.getElementById('Consignee-Invoice-no').value = bill.consigneeInvoiceNo;

    // Populate goods entries
    const goodsEntries = bill.goodsEntries;
    const goodsTable = document.getElementById('goods-entries');
    goodsTable.innerHTML = ''; // Clear existing rows

    goodsEntries.forEach((entry) => {
        const row = goodsTable.insertRow();
        row.innerHTML = `
            <td><input type="text" class="goods" value="${entry.goods}"></td>
            <td><input type="number" class="no-articles" value="${entry.noOfArticles}"></td>
            <td><input type="number" class="rate-per-article" value="${entry.ratePerArticle}"></td>
            <td><input type="number" class="gst" value="${entry.gst}"></td>
            <td><input type="number" class="gst-amt" value="${entry.gstAmt}"></td>
            <td><input type="number" class="freight" value="${entry.freight}"></td>
            <td><input type="number" class="total" value="${entry.total}"></td>
        `;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const editBillIndex = localStorage.getItem("editBillIndex");
    if (editBillIndex !== null) {
        loadBillFromServer(editBillIndex);  // Load the bill from server if editing
    }
});
function newBill() {
    // Clear all input fields
    document.getElementById('lr-no').value = '';
    document.getElementById('date').value = '';
    document.getElementById('gst-paid-by').value = '';
    document.getElementById('payment-mode').value = '';
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('consigner').value = '';
    document.getElementById('consigner-address').value = '';
    document.getElementById('consignee').value = '';
    document.getElementById('consignee-address').value = '';
    document.getElementById('Consignee-Invoice-no').value = '';

    // Clear goods entries
    const goodsTable = document.getElementById('goods-entries');
    goodsTable.innerHTML = ''; // Clear existing rows

// Generate a new LR number based on the last saved bill
generateLRNo();
setCurrentDate();

}


    // Function to set the current date in the date input field
    function setCurrentDate() {
        const dateInput = document.getElementById('date'); // Get the date input element
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        dateInput.value = today; // Set the value of the date input
    }

      // Call this function when the page loads
      window.onload = function() {
        console.log("Setting current date..."); // Debugging line
        setCurrentDate();

        // This will only generate an LR number if you're creating a new bill
        const isNewBill = !localStorage.getItem('editBillIndex'); // Only if not editing
        if (isNewBill) {
            generateLRNo();
        }
    };
// Function to modify the bill (simulation)
function modifyBill() {
    alert("Modify Bill functionality not implemented yet.");
    // Implement modify logic
}



// Function to delete a bill
function deleteBill(index) {
    const bills = JSON.parse(localStorage.getItem("bills")) || [];
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    loadReports(); // Refresh the report table after deletion
}


// Function to close the form
function closeForm() {
    document.getElementById("billing-form").reset();
    document.getElementById("goods-form").reset();
    document.getElementById("billing-details-form").reset();
    document.getElementById("bill-preview").style.display = 'none'; // Hide the bill preview
}