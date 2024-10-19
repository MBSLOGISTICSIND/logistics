
// Function to display main section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
    });

    // Show the clicked section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
        console.log(`Displaying section: ${sectionId}`);  // Debug log
    }

    // Show sub-tabs for billing section
    if (sectionId === 'billing') {
        document.getElementById('billing-sub-tabs').style.display = 'flex';
    } else {
        document.getElementById('billing-sub-tabs').style.display = 'none';
    }

    // Load reports in iframe if reports section is active
    if (sectionId === 'reports') {
        const reportsIframe = document.getElementById('reports-content');
        reportsIframe.src = 'home/bill/report.html'; // Adjust path if needed
        console.log('Loading reports from:', reportsIframe.src); // Debugging log
    }

        // Load expenses in iframe if the "money-reports" section is active
        if (sectionId === 'money-reports') {
            const reportsIframe = document.getElementById('money-reports-content');
            reportsIframe.src = 'home/bill/Expenses.html'; // Adjust path if needed
            console.log('Loading expenses from:', reportsIframe.src); // Debugging log
        }
}

function initialize() {
    // Check if there's a hash in the URL
    const currentSection = window.location.hash.replace('#', '') || 'home';
    
  // Log the current section to verify
  console.log('Current section on load:', currentSection);

    // If there's no hash, default to 'home'
    if (!window.location.hash) {
        window.location.hash = 'home';
        console.log('No hash found, setting default to home');
    }
    
    // Show the section
    showSection(currentSection);
}


// Call initialize when the window loads
window.onload = initialize;


// Function to display billing sub-section
function showBillingSection(sectionId) {
    console.log("Requested Section:", sectionId); // Ensure the correct section is being passed

    const billingSections = document.querySelectorAll('.billing-section');
    billingSections.forEach(section => {
        section.style.display = 'none'; // Hide all billing sections
    });

    // Check if the sectionId exists in the DOM
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block'; // Show selected billing section
    } else {
        console.error("Section ID not found:", sectionId);
    }

    const billingContent = document.getElementById('billing-content');

    // Convert sectionId to lowercase for consistency
    const lowerSectionId = sectionId.toLowerCase();

    if (lowerSectionId === 'bill') {
        billingContent.innerHTML = '<iframe src="home/bill/index1.html" style="width: 100%; height: 100vh; border: none;"></iframe>';
    } else if (lowerSectionId === 'receipts') {
        billingContent.innerHTML = '<iframe src="home/bill/Recipt.html" style="width: 100%; height: 100vh; border: none;"></iframe>';
    } else if (lowerSectionId === 'expenses') {
        billingContent.innerHTML = '<iframe src="home/bill/Expenses.html" style="width: 100%; height: 100vh; border: none;"></iframe>';
        console.log('Loading expenses'); // Confirm expenses loading
    } else {
        billingContent.innerHTML = '<p>' + sectionId + ' content will go here.</p>';
    }
}

// Set default section on load
window.onload = function() {
    showSection('vehicle-records'); // Default to vehicle records
    showBillingSection('bill'); // Default to billing tab
    const savedNote = localStorage.getItem('savedNote');
    if (savedNote) {
        notepadContent.value = savedNote;
    }
    fetchBills(); // Load bills on page load
};



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
           <td><input type="date" class="permit-expiry"></td>
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
    const permitExpiry = row.querySelector('.permit-expiry').value;

    if (vehicleName && ownerName && driverName && driverLicense && vehicleFC && insuranceExpiry && permitExpiry) {
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
                expiry: insuranceExpiry,
                permit: permitExpiry
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
             <td>${record.permit}</td>
            <td>
                <button onclick="editRecord(${index})">Edit</button>
                <button onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);

            // Check if insurance expiry is within a month or has expired
            const oneMonthLater = new Date(today);
            oneMonthLater.setMonth(today.getMonth() + 1);
            if (expiryDate < oneMonthLater) {
                expiringSoon.push(`${record.name} (expires on: ${record.expiry})`);
            }
        });
    
        // Show a modal for expiring or expired insurance
        if (expiringSoon.length > 0) {
            const message = `
            🚨 <strong>Insurance Alert!</strong> 🚨
            
            The following vehicles have insurance that is <strong>expiring soon</strong> or <strong>has already expired</strong>:
            
            ${expiringSoon.map(vehicle => `• <strong>${vehicle}</strong>`).join('<br>')}
            
            Please take action to renew the insurance as soon as possible to avoid any issues.
            📝 Stay Safe!
            `;
            
            showModal(message); // Use the modal instead of alert
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
           <td><input type="date" value="${record.permit}" class="permit-expiry"></td>
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
    const permitExpiry = row.querySelector('.permit-expiry').value;


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
            expiry: insuranceExpiry,
            permit: permitExpiry
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

window.onload = function() {
    checkInsuranceExpiry();
};

// Function to check all vehicle records for insurance expiry
function checkInsuranceExpiry() {
    const vehicleRecords = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
    const today = new Date();
    const expiringSoon = [];

    vehicleRecords.forEach(record => {
        const expiryDate = new Date(record.expiry);
        const oneMonthLater = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        if (expiryDate < today) {
            expiringSoon.push(`${record.name} (Expired on: ${record.expiry})`);
        } else if (expiryDate < oneMonthLater) {
            expiringSoon.push(`${record.name} (Expires on: ${record.expiry})`);
        }
    });

    // Show a popup for expiring or expired insurance through the modal
    if (expiringSoon.length > 0) {
        showModal(`The following vehicles' insurance is expiring soon or has expired:\n\n${expiringSoon.join('\n')}`);
    }
}

// Function to show the modal with the expiring insurance message
function showModal(message) {
    const modal = document.getElementById('insuranceModal');
    const modalText = document.getElementById('modalText');
    const closeModal = document.querySelector('.close-btn');
    const confirmBtn = document.getElementById('confirmBtn');

    modalText.innerHTML = message;
    modal.style.display = 'block';

    // Close modal on 'x' button click
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal on Confirm button click
    confirmBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}



// Use environment variables for sensitive information
//require('dotenv').config();
// Function to send SMS using Twilio API
//function sendSMS(message) {
  //  const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Ensure this is set correctly
    //const authToken = process.env.TWILIO_AUTH_TOKEN;    // Ensure this is set correctly
    //const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;  // Twilio Number from environment
    //const recipientNumber = '+919481155714';  // Make sure the recipient number is in E.164 format

    // Check if environment variables are correctly loaded
    //if (!accountSid || !authToken || !twilioPhoneNumber) {
      //  console.error("Twilio credentials are not set properly.");
        //return;
    //}

   // const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    //fetch(url, {
      //  method: 'POST',
       // body: new URLSearchParams({
         //   'To': recipientNumber,
           // 'From': twilioPhoneNumber,  // From Twilio number (environment variable)
           // 'Body': message
      //  }),
       // headers: {
         //   'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
           // 'Content-Type': 'application/x-www-form-urlencoded'
     //   }
   // })
    //.then(response => {
      //  if (!response.ok) {
        //    console.error(`Error sending SMS: ${response.statusText}`);
          //  return response.json().then(errorData => console.error(errorData));
     //   }
       // return response.json();
//    })
  //  .then(data => {
    //    console.log(`SMS sent successfully! SID: ${data.sid}`);
   // })
    //.catch(error => {
     //   console.error('Error sending SMS:', error);
   // });
//}

// Example usage
//sendSMS('Vehicle insurance is expiring soon!');



//Functions Calculator 
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

