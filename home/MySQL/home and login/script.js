


// Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Replace these with your actual credentials or validation logic
    const validUsername = 'admin';
    const validPassword = 'password';

    if (username === validUsername && password === validPassword) {
        // On successful login, redirect to the home page
        window.location.href = 'home.html'; // Change to the actual home page URL
    } else {
        // Show error message if login fails
        const errorMessage = document.getElementById('login-error');
        errorMessage.style.display = 'block'; // Show the error message
    }
}

// Function to display main section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });
    document.getElementById(sectionId).style.display = 'block'; // Show selected section
}

// Function to display billing sub-section
function showBillingSection(sectionId) {
    const billingSections = document.querySelectorAll('.billing-section');
    billingSections.forEach(section => {
        section.style.display = 'none'; // Hide all billing sections
    });
    document.getElementById(sectionId).style.display = 'block'; // Show selected billing section
}

// Set default section on load
window.onload = function() {
    showSection('vehicle-records'); // Default to vehicle records
    showBillingSection('bill'); // Default to billing tab
};
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });

    document.getElementById(sectionId).style.display = 'block'; // Show the clicked section
    
    // Show sub-tabs for billing section
    if (sectionId === 'billing') {
        document.getElementById('billing-sub-tabs').style.display = 'flex';
    } else {
        document.getElementById('billing-sub-tabs').style.display = 'none';
    }
}

function showBillingSection(sectionId) {
    if (sectionId === 'bill') {
        // Load index1.html inside the 'billing' section using an iframe
        document.getElementById('billing-content').innerHTML = '<iframe src="home/bill/index1.html" style="width: 100%; height: 100vh; border: none;"></iframe>';
    } else {
        // Handle other sections if needed
        document.getElementById('billing-content').innerHTML = '<p>' + sectionId + ' content will go here.</p>';
    }
}

// Vehicle Records Functions
document.addEventListener("DOMContentLoaded", loadVehicleRecords);

function addVehicleRow() {
    const tableBody = document.getElementById('vehicle-body');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="file" onchange="previewImage(event)" class="vehicle-image"></td>
        <td><input type="text" placeholder="Vehicle Name" class="vehicle-name"></td>
        <td><input type="text" placeholder="Owner Name" class="owner-name"></td>
        <td><input type="text" placeholder="Driver Name" class="driver-name"></td>
        <td><input type="text" placeholder="Driver License" class="driver-license"></td>
        <td><input type="date" class="vehicle-fc"></td>
        <td><input type="date" class="insurance-expiry"></td>
        <td>
            <button onclick="saveRecord(this)">Save</button>
            <button onclick="deleteRecord(this)">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow);
}

function saveRecord(button) {
    const row = button.closest('tr');
    const imageInput = row.querySelector('.vehicle-image').files[0];
    const vehicleName = row.querySelector('.vehicle-name').value;
    const ownerName = row.querySelector('.owner-name').value;
    const driverName = row.querySelector('.driver-name').value;
    const driverLicense = row.querySelector('.driver-license').value;
    const vehicleFC = row.querySelector('.vehicle-fc').value;
    const insuranceExpiry = row.querySelector('.insurance-expiry').value;

    if (vehicleName && ownerName && driverName && driverLicense && vehicleFC && insuranceExpiry) {
        let vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageBase64 = imageInput ? event.target.result : '';

            const newRecord = {
                image: imageBase64,
                name: vehicleName,
                owner: ownerName,
                driver: driverName,
                license: driverLicense,
                fc: vehicleFC,
                expiry: insuranceExpiry
            };

            vehicleRecords.push(newRecord);
            localStorage.setItem('vehicleRecords', JSON.stringify(vehicleRecords));

            checkInsuranceExpiry(insuranceExpiry);
            loadVehicleRecords();
        };

        if (imageInput) {
            reader.readAsDataURL(imageInput);
        } else {
            reader.onload();
        }
    } else {
        alert('Please fill in all fields.');
    }
}

function loadVehicleRecords() {
    const tableBody = document.getElementById('vehicle-body');
    tableBody.innerHTML = '';

    const vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
    const today = new Date();
    let expiringSoon = [];

    vehicleRecords.forEach((record, index) => {
        const expiryDate = new Date(record.expiry);
        const imageTag = record.image ? `<img src="${record.image}" style="width: 100px; height: 100px;" />` : 'No Image';

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${imageTag}</td>
            <td>${record.name}</td>
            <td>${record.owner}</td>
            <td>${record.driver}</td>
            <td>${record.license}</td>
            <td>${record.fc}</td>
            <td>${record.expiry}</td>
            <td>
                <button onclick="editRecord(${index})">Edit</button>
                <button onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);

        // Check if insurance expiry is within a month or has expired
        const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));
        if (expiryDate < oneMonthLater) {
            expiringSoon.push(`${record.name} (expires on: ${record.expiry})`);
        }
    });

    // Show a popup for expiring or expired insurance
    if (expiringSoon.length > 0) {
        alert(`The following vehicles' insurance is expiring soon or has expired:\n\n${expiringSoon.join('\n')}`);
    }
}

function deleteRecord(index) {
    let vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
    vehicleRecords.splice(index, 1);
    localStorage.setItem('vehicleRecords', JSON.stringify(vehicleRecords));
    loadVehicleRecords();
}

function editRecord(index) {
    let vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
    const record = vehicleRecords[index];

    const tableBody = document.getElementById('vehicle-body');
    const row = tableBody.children[index];

    row.innerHTML = `
        <td><input type="file" onchange="previewImage(event)" class="vehicle-image"></td>
        <td><input type="text" value="${record.name}" class="vehicle-name"></td>
        <td><input type="text" value="${record.owner}" class="owner-name"></td>
        <td><input type="text" value="${record.driver}" class="driver-name"></td>
        <td><input type="text" value="${record.license}" class="driver-license"></td>
        <td><input type="date" value="${record.fc}" class="vehicle-fc"></td>
        <td><input type="date" value="${record.expiry}" class="insurance-expiry"></td>
        <td>
            <button onclick="updateRecord(${index})">Update</button>
            <button onclick="cancelEdit()">Cancel</button>
        </td>
    `;
}

function updateRecord(index) {
    const row = document.getElementById('vehicle-body').children[index];
    const imageInput = row.querySelector('.vehicle-image').files[0];
    const vehicleName = row.querySelector('.vehicle-name').value;
    const ownerName = row.querySelector('.owner-name').value;
    const driverName = row.querySelector('.driver-name').value;
    const driverLicense = row.querySelector('.driver-license').value;
    const vehicleFC = row.querySelector('.vehicle-fc').value;
    const insuranceExpiry = row.querySelector('.insurance-expiry').value;

    let vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageBase64 = imageInput ? event.target.result : vehicleRecords[index].image;

        vehicleRecords[index] = {
            image: imageBase64,
            name: vehicleName,
            owner: ownerName,
            driver: driverName,
            license: driverLicense,
            fc: vehicleFC,
            expiry: insuranceExpiry
        };

        localStorage.setItem('vehicleRecords', JSON.stringify(vehicleRecords));

        checkInsuranceExpiry(insuranceExpiry);
        loadVehicleRecords();
    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    } else {
        reader.onload();
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.width = '100px';
        img.style.height = '100px';
        event.target.parentElement.appendChild(img);
    }
}

function checkInsuranceExpiry(expiryDate) {
    const expiry = new Date(expiryDate);
    const today = new Date();

    if (expiry < today) {
        alert('Vehicle insurance has expired!');
        sendSMS("Insurance expired for vehicle!");
    } else if (expiry - today < 30 * 24 * 60 * 60 * 1000) {  // Less than a month left
        alert('Vehicle insurance will expire soon!');
        sendSMS("Vehicle insurance is expiring soon!");
    }
}

function sendSMS(message) {
    const phoneNumber = '9481155714';
    
    // Here you'll need to integrate an SMS API like Twilio
    //  (use Twilio's REST API):
    /*
    fetch('https://api.twilio.com/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXX/Messages.json', {
        method: 'POST',
        body: new URLSearchParams({
            'To': phoneNumber,
            'From': 'YOUR_TWILIO_PHONE_NUMBER',
            'Body': message
        }),
        headers: {
            'Authorization': 'Basic ' + btoa('ACXXXXXXXXXXXXXXXXX:your_auth_token')
        }
    }).then(response => response.json()).then(data => console.log(data));
    */
    
    console.log(`SMS to ${phoneNumber}: ${message}`);
}




// Calculator Functions
let calcDisplay = document.getElementById('calc-display');

function appendValue(value) {
    calcDisplay.value += value;
}

function clearDisplay() {
    calcDisplay.value = '';
}

function calculateResult() {
    try {
        calcDisplay.value = eval(calcDisplay.value);
    } catch (error) {
        calcDisplay.value = 'Error';
    }
}

// Notepad Functions
let notepadContent = document.getElementById('notepad-content');

function saveNote() {
    const note = notepadContent.value;
    localStorage.setItem('savedNote', note);
    alert("Note saved!");
}

function clearNote() {
    notepadContent.value = '';
    localStorage.removeItem('savedNote');
    alert("Note cleared!");
}

// Load saved note on page load
window.onload = function() {
    const savedNote = localStorage.getItem('savedNote');
    if (savedNote) {
        notepadContent.value = savedNote;
    }
};

function fetchBills() {
    const reportsSection = document.getElementById("reports-section");
    reportsSection.innerHTML = ''; // Clear existing reports

    // Get bills from local storage
    let bills = JSON.parse(localStorage.getItem('bills')) || [];

    if (bills.length === 0) {
        reportsSection.innerHTML = '<tr><td colspan="17" class="no-records">No records found</td></tr>';
        return;
    }

    // Loop through each bill and create a table row
    bills.forEach((bill, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${bill.lr_no}</td>
            <td>${bill.manual_bill_no}</td>
            <td>${bill.bill_no}</td>
            <td>${bill.customer_name}</td>
            <td>${bill.from_location}</td>
            <td>${bill.to_location}</td>
            <td>${bill.consignor}</td>
            <td>${bill.consignee}</td>
            <td>${bill.goods}</td>
            <td>${bill.no_of_articles}</td>
            <td>${bill.rate_per_article}</td>
            <td>${bill.gst_amount}</td>
            <td>${bill.freight}</td>
            <td>${bill.total}</td>
            <td>${new Date(bill.date).toLocaleDateString()}</td>
            <td>${new Date(`1970-01-01T${bill.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td><button onclick="deleteBill(${index})">Delete</button></td>
        `;
        reportsSection.appendChild(row);
    });
}

function deleteBill(index) {
    // Get bills from local storage
    let bills = JSON.parse(localStorage.getItem('bills')) || [];

    // Remove the bill at the specified index
    bills.splice(index, 1);

    // Save updated bills back to local storage
    localStorage.setItem('bills', JSON.stringify(bills));

    // Refresh the report display
    fetchBills();
}

function sortBills() {
    const criteria = document.getElementById('sort-by').value;
    let bills = JSON.parse(localStorage.getItem('bills')) || [];

    // Sort bills based on the selected criteria
    bills.sort((a, b) => {
        if (criteria === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else if (criteria === 'branch') {
            return a.branch ? a.branch.localeCompare(b.branch) : 0; // Assuming branch exists in bill data
        } else if (criteria === 'consigner') {
            return a.consignor.localeCompare(b.consignor);
        }
    });

    // Update the displayed bills
    fetchBills(); // Call fetchBills to re-render sorted data
}

// Call fetchBills when the page loads
window.onload = fetchBills;



app.post('/api/bills', (req, res) => {
    const { lrNo, manualBillNo, billNo, customerName, from, to, consignor, consignee, goods, noOfArticles, ratePerArticle, gstPercentage, gstAmount, freight, totalAmount, date, time } = req.body;

    const query = 'INSERT INTO bills (lrNo, manualBillNo, billNo, customerName, `from`, `to`, consignor, consignee, goods, noOfArticles, ratePerArticle, gstPercentage, gstAmount, freight, totalAmount, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    connection.query(query, [lrNo, manualBillNo, billNo, customerName, from, to, consignor, consignee, goods, noOfArticles, ratePerArticle, gstPercentage, gstAmount, freight, totalAmount, date, time], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error saving bill", error: err });
        }
        res.status(201).json({ message: "Bill saved successfully", billId: result.insertId });
    });
});


// Endpoint to fetch bills
app.get('/api/get-bills', (req, res) => {
    db.query('SELECT * FROM bills ORDER BY date DESC', (error, results) => {
        if (error) {
            console.error('Error fetching bills:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});