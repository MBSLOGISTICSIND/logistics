// Function to save expense details to local storage
function saveExpense() {
    const description = document.getElementById('description').value;
    const reason = document.getElementById('reason').value;
    const person = document.getElementById('person').value;
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const source = document.getElementById('source').value;

    // Create an expense object
    const expense = {
        description,
        reason,
        person,
        date,
        amount,
        source
    };

    // Check if editing an existing expense
    const editIndex = localStorage.getItem('editExpenseIndex');
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (editIndex !== null) {
        expenses[editIndex] = expense;  // Update existing expense
        localStorage.removeItem('editExpenseIndex');
        alert('Expense updated successfully!');
    } else {
        expenses.push(expense); // Add new expense
        alert('Expense saved successfully!');
    }

    // Save back to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Reset form fields
    document.getElementById('expenseForm').reset();

    // Fetch updated expenses
    fetchExpenses();
}

// Function to fetch and display expenses
function fetchExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseBody = document.getElementById('expenseBody');
    expenseBody.innerHTML = ''; // Clear existing entries

    // Populate the table with expenses
    expenses.forEach((expense, index) => {
        expenseBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${expense.description}</td>
                <td>${expense.reason}</td>
                <td>${expense.person}</td>
                <td>${expense.date}</td>
                <td>${expense.amount}</td>
                <td>${expense.source}</td>
                <td>
                    <button onclick="editExpense(${index})">Edit</button>
                    <button onclick="removeExpense(${index})">Remove</button>
                </td>
            </tr>
        `;
    });
}

// Function to edit an expense
function editExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];

    document.getElementById('description').value = expense.description;
    document.getElementById('reason').value = expense.reason;
    document.getElementById('person').value = expense.person;
    document.getElementById('date').value = expense.date;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('source').value = expense.source;

    localStorage.setItem('editExpenseIndex', index);
}

// Function to remove an expense
function removeExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1); // Remove the selected expense

    // Save updated expenses back to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Fetch updated expenses
    fetchExpenses();
}

// Function to print expenses (this can be customized further)
function printExpenses() {
    window.print();
}

// Function to export expenses to CSV
function exportExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Description,Reason,Person,Date,Amount,Source\n"; // CSV headers

    expenses.forEach(expense => {
        const row = `${expense.description},${expense.reason},${expense.person},${expense.date},${expense.amount},${expense.source}`;
        csvContent += row + "\n";
    });

    // Create a downloadable link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
}

// Load expenses on page load
window.onload = fetchExpenses;
