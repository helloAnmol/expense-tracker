# Expense Tracker

A lightweight, responsive web application that helps users track their daily income and expenses. The application provides a visual breakdown of spending habits and securely saves data locally in the browser.

## Features

* **Financial Dashboard:** Displays total balance, total income, and total expenses dynamically based on user entries.
* **Transaction Management:** Users can add new transactions, edit existing entries, or delete them entirely.
* **Advanced Filtering:** Includes a search bar to find specific transactions by description and a month-filter to view transactions from a specific time frame.
* **Data Visualization:** Utilizes Chart.js to render a responsive doughnut chart that categorizes and visualizes expense data.
* **Persistent Storage:** Saves all transaction data locally using the browser's `localStorage`, ensuring data is not lost when the page is refreshed.
* **Responsive Design:** Adapts smoothly to mobile devices using CSS Grid layouts and responsive media queries.

## Technology Stack

* **HTML5:** Semantic structure and form handling.
* **CSS3:** Custom variables, grid layouts, and hover transitions for a modern UI.
* **Vanilla JavaScript:** DOM manipulation, array filtering, and state management without external JS frameworks.
* **Chart.js:** Included via CDN for rendering the category expense chart.
* **FontAwesome:** Included via CDN for UI icons.

## Usage

1. Clone the repository or download the source files.
2. Open `index.html` in any modern web browser. No local server or build process is required.
3. Use the **Add New Transaction** form to input an income or expense.
4. View your updated dashboard, transaction list, and interactive chart.

## File Structure

* `index.html`: Contains the core layout, input forms, and CDN links.
* `script.js`: Contains the logic for the application, including the `init()`, `updateDashboard()`, and `updateChart()` functions.
* `style.css`: Contains the styling rules, CSS variables, and responsive layout configurations.
