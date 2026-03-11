# Dicalo Fashion Frontend Documentation

Project location in this repository: `frontend/`

## 1. Project Overview
Dicalo Fashion is a modern fashion e-commerce frontend focused on:
- Seamless shopping experience
- Fast page loads
- Responsive mobile-first UI
- State-managed cart and session
- Admin dashboard with analytics visualization

## 2. Tech Stack and Why
| Technology | Purpose | Why |
| --- | --- | --- |
| React | UI library | Component-based architecture |
| Vite | Build tool | Fast dev server and optimized builds |
| Redux Toolkit | State management | Minimal Redux boilerplate |
| Tailwind CSS | Styling | Utility-first responsive styling |
| Recharts | Data visualization | Simple React-native chart components |

## 3. Project Setup
### 3.1 Create project with Vite
```bash
npm create vite@latest dicalo-fashion
cd dicalo-fashion
npm install
```

Choose:
- React
- JavaScript

Start dev server:
```bash
npm run dev
```

### 3.3 Backend integration readiness
Create `.env` (or `.env.local`) for API configuration:
```bash
VITE_API_BASE_URL=/api
VITE_USE_MOCK_DATA=false
```

Notes:
- `VITE_API_BASE_URL` points frontend API calls to backend base path.
- `VITE_USE_MOCK_DATA=true` forces frontend mock catalog mode while backend is still in progress.
- When backend is offline and mock mode is not forced, the shop automatically falls back to mock products and admin stays read-only.

### 3.2 Install dependencies
```bash
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install tailwindcss postcss autoprefixer
npm install recharts
```

Initialize Tailwind:
```bash
npx tailwindcss init -p
```

`tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 4. Project Folder Structure
```text
src/
├── app/
│   └── store.js
├── layouts/
│   └── MainLayout.jsx
├── router/
│   ├── AppRouter.jsx
│   └── paths.js
├── components/
│   ├── BrandLogo.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   └── Shop.jsx
├── features/
│   ├── auth/
│   │   └── authSlice.js
│   ├── cart/
│   │   └── cartSlice.js
│   └── products/
│       └── productSlice.js
├── index.css
├── App.jsx
└── main.jsx
```

## 5. Redux Toolkit Setup
### 5.1 Store configuration (`src/app/store.js`)
```js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
```

### 5.2 Cart slice example (`src/features/cart/cartSlice.js`)
```js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      state.totalQuantity += 1;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalQuantity -= 1;
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
```

Wrap app in `src/main.jsx`:
```jsx
import { Provider } from "react-redux";
import { store } from "./app/store";

<Provider store={store}>
  <App />
</Provider>
```

## 6. Routing Setup
Install:
```bash
npm install react-router-dom
```

Example `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 7. Tailwind UI Example
`ProductCard.jsx`:
```jsx
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
      <img src={product.image} className="w-full h-60 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button className="bg-black text-white px-4 py-2 mt-2 rounded hover:bg-gray-800">
        Add to Cart
      </button>
    </div>
  );
};
```

## 8. Admin Dashboard Visualization (Recharts)
```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 700 },
  { month: "Mar", sales: 1000 },
];

const SalesChart = () => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="sales" stroke="#000" />
  </LineChart>
);
```

## 9. Key Features
- Shopping cart: add/remove/quantity
- Product filtering: category, price, search
- Admin analytics: trends, top products, revenue summary
- Authentication planned: JWT + Redux auth slice

## 10. Responsive Strategy
Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
```

Breakpoints used: `sm`, `md`, `lg`, `xl`.

## 11. Performance
- Vite production builds
- Lazy loaded pages
- Image optimization
- Memoization with `React.memo`

## 12. Deployment
Build:
```bash
npm run build
```

Common targets:
- Vercel
- Netlify
- Firebase Hosting

## 13. Future Improvements
- Stripe payments
- Wishlist
- Dark mode
- Product reviews
- Order tracking
- Backend integration (Node/Express or existing FastAPI)

## 14. Architecture Summary
Frontend flow:
```text
User -> React Components -> Redux Store -> API
                              -> Admin Dashboard (Charts)
```

## 15. Current Repository Note
This repository currently serves frontend through FastAPI static hosting.
If you migrate fully to Vite structure above, keep backend API endpoints under `/api/*` and configure frontend proxy or environment-based API URL.
