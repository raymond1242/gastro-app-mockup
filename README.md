# GastroApp

A modern restaurant point-of-sale (POS) system mockup built with React and Tailwind CSS. This application provides table management, order tracking, menu administration, and financial reporting for restaurant operations.

## Features

### Table Management (Mesas)
- Visual grid layout showing all tables in the restaurant
- Real-time table status (Available/Occupied)
- Display of current order total for occupied tables
- Quick access to table orders with a single click

### Order Management (Pedidos)
- **A la Carta Mode**: Select dishes from the menu with customizable quantity and price
- **Buffet/Weight Mode**: Calculate prices based on weight (grams) with configurable price per kilogram
- Associate items with customer names for split billing
- Real-time order total calculation
- Order status tracking (Pending/Completed)

### Payment Processing
- Multiple payment methods: Cash, Yape, Plin, Card
- Split payment support across multiple customers
- Real-time balance tracking
- Payment history per order
- Automatic order completion when fully paid

### Menu Management (Carta)
- Add, edit, and delete menu items
- Categorize dishes (Appetizers, Main Courses, Beverages, Desserts)
- Set base prices for each item

### Financial Reports
- Daily income summary
- Breakdown by payment method
- Detailed transaction history
- Time-stamped payment records

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gastro-app-mockup

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
gastro-app-mockup/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## Usage

1. **Tables View**: Click on any table to open/create an order
2. **Adding Items**: Use the tabs to switch between "A la Carta" (menu items) or "Buffet/Peso" (weight-based)
3. **Processing Payments**: Enter payment details in the right panel, select method, and register
4. **Completing Orders**: Orders can only be finalized when the balance is fully paid
5. **Menu Management**: Navigate to "Gestionar Carta" to add or modify menu items
6. **Reports**: View daily financial summary in the "Reportes" section

## Demo Data

The application comes pre-loaded with:
- 9 tables
- Sample menu items (Peruvian cuisine):
  - Lomo Saltado (S/ 35.00)
  - Ceviche Clásico (S/ 28.00)
  - Ají de Gallina (S/ 25.00)
  - Inca Kola 1L (S/ 12.00)
  - Pisco Sour (S/ 22.00)

## License

This project is for demonstration purposes.
