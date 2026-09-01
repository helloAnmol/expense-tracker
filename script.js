// --- DOM Elements ---
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const formTitle = document.getElementById('form-title');
const searchEl = document.getElementById('search');
const monthFilterEl = document.getElementById('month-filter');

// Form Inputs
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

// --- State Management ---
// Fetch from local storage or set empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editId = null;
let expenseChart = null;

// Set default date to today
dateInput.value = new Date().toISOString().split('T')[0];

// --- Core Functions ---

// 1. Initialize App
function init() {
    renderTransactions();
    updateDashboard();
    updateChart();
}

// 2. Add or Edit Transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        id: editId !== null ? editId : generateID(),
        desc: descInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: categoryInput.value,
        date: dateInput.value
    };

    if (editId !== null) {
        // Update existing
        transactions = transactions.map(t => t.id === editId ? transaction : t);
        editId = null;
        formTitle.innerText = "Add New Transaction";
        form.querySelector('button').innerText = "Add Transaction";
    } else {
        // Add new
        transactions.push(transaction);
    }

    updateLocalStorage();
    form.reset();
    dateInput.value = new Date().toISOString().split('T')[0]; // reset date to today
    init();
});

// 3. Render Transactions to DOM
function renderTransactions() {
    listEl.innerHTML = '';
    
    // Get filter values
    const searchTerm = searchEl.value.toLowerCase();
    const filterMonth = monthFilterEl.value; // format: "YYYY-MM"

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.desc.toLowerCase().includes(searchTerm);
        const matchesMonth = filterMonth ? t.date.startsWith(filterMonth) : true;
        return matchesSearch && matchesMonth;
    });

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if(filteredTransactions.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; color:#6b7280; padding: 20px;">No transactions found.</p>';
        return;
    }

    filteredTransactions.forEach(t => {
        const sign = t.type === 'income' ? '+' : '-';
        const li = document.createElement('li');
        li.classList.add('transaction-item');
        
        li.innerHTML = `
            <div class="transaction-info">
                <h4>${t.desc}</h4>
                <small>${t.date} <span class="category-badge">${t.category}</span></small>
            </div>
            <div style="display:flex; align-items:center; gap: 15px;">
                <span class="transaction-amount ${t.type}">
                    ${sign}$${t.amount.toFixed(2)}
                </span>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editTransaction(${t.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        listEl.appendChild(li);
    });
}

// 4. Update Balance, Income, Expense
function updateDashboard() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0).toFixed(2);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toFixed(2);

    balanceEl.innerText = `$${total}`;
    incomeEl.innerText = `+$${income}`;
    expenseEl.innerText = `-$${expense}`;
}

// 5. Chart.js Integration
function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Calculate expenses by category
    const expenseCategories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);

    // Destroy old chart if it exists so it can redraw smoothly
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Expenses'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: data.length 
                    ? ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                    : ['#e5e7eb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 6. Delete Transaction
window.deleteTransaction = function(id) {
    if(confirm('Are you sure you want to delete this?')) {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    }
}

// 7. Edit Transaction
window.editTransaction = function(id) {
    const t = transactions.find(t => t.id === id);
    if(t) {
        descInput.value = t.desc;
        amountInput.value = t.amount;
        typeInput.value = t.type;
        categoryInput.value = t.category;
        dateInput.value = t.date;
        
        editId = id;
        formTitle.innerText = "Edit Transaction";
        form.querySelector('button').innerText = "Update Transaction";
        
        // Scroll to form smoothly
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// 8. Utility Functions
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// --- Event Listeners for Filters ---
searchEl.addEventListener('input', renderTransactions);
monthFilterEl.addEventListener('change', renderTransactions);

// Start App
init();