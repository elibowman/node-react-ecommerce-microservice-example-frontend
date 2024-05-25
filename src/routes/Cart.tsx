import { useContext, useEffect, useState } from "react"
import { MainContext } from "../store/MainContextWrapper"
import NavBar from "./NavBar";
import { redirect, useNavigate } from "react-router-dom";

export interface CartItem {
    _id: string,
    userId: string
    name: string,
    imagePath: string[],
    price: number,
    quantity: number
}

const getCart = async (userId: any, dispatch: any) => {
    try {
        const response = await fetch('http://localhost:3000/cart/' + userId);
        let cart = await response.json();

        cart = await Promise.all((cart as []).map(async ({ userId, productId, quantity }, _i) => {        
            return {
                userId,
                ...(await getProduct(productId)),
                quantity
            }
        }));
    
        dispatch({
            type: 'setCart',
            state: {
                cart
            }
        });
    }
    catch {
        console.log('Error getting cart');
    }
};

export const getProduct = async (id: number) => {
    try {
        const response = await fetch('http://localhost:3000/product/' + id);
        const responseJson = await response.json();
        return responseJson[0];
    }
    catch {
        console.log('Error getting product');
    }
}

const Cart = () => {
    const { state: { userId, cart }, dispatch } = useContext(MainContext);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (userId) {
                getCart(userId, dispatch);
            }
        }
        catch {
            console.log('Error getting cart');
        }    
    }, [])

    const calculateTotal = () => {
        try {
            return cart?.map((cartItem: CartItem) => cartItem.price * cartItem.quantity)?.reduce((previousPrice: number, currentPrice: number) => {
                return previousPrice + currentPrice;
            }, 0);
        }
        catch {
            console.log('Error calculating total');
        }
    }

    const SUBTOTAL = calculateTotal();

    const checkoutCart = async (_e: any) => {
        return navigate('/checkout-cart');
    }

    return (
        <>
            <NavBar/>
            <div className="cart-table-div-container">
                <table className="cart-table">
                    <thead>
                        <tr className="cart-table-header-row">
                            <th>Product id</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart?.map((cartItem: CartItem, i: number) => (
                            <tr key={i} className="cart-table-data-row">
                                <td>{cartItem._id}</td>
                                <td>{cartItem.name}</td>
                                <td>
                                    <input id="cart-table-quantity-input" type="number" value={cartItem.quantity} onChange={ e => { console.log(e.target.value);} } pattern="[0-9]{0,3}" min={0} max={30}/>
                                </td>
                                <td>${(cartItem.price * cartItem.quantity)?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>                    
                </table>
                <table className="cart-table-aggregation-table">
                    <tbody>
                        <tr>
                            <td>Subtotal</td>
                            <td>${SUBTOTAL > 0 ? SUBTOTAL?.toFixed(2) : 0}</td>
                        </tr>
                    </tbody>
                </table>
                <button id="checkout-cart-button" onClick={checkoutCart}>Checkout cart</button>
            </div>
        </>
    )
};

export default Cart;