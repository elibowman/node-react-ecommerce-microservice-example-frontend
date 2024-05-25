import React, { useContext, createContext, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Products from './routes/Products';
import Login from './routes/Login';
import Product from './routes/Product';
import MainContextWrapper from './store/MainContextWrapper';
import Cart from './routes/Cart';
import CheckoutCart from './routes/CheckoutCart'
import { Order } from './routes/Order';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Products/>,
  },
  {
    path: '/product/:id',
    element: <Product/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/cart",
    element: <Cart/>
  },
  {
    path: "/checkout-cart",
    element: <CheckoutCart/>
  },
  {
    path: "/order-confirmation",
    element: <Order/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainContextWrapper>
      <RouterProvider router={router} />
    </MainContextWrapper>
  </React.StrictMode>
)
