import { Form, useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import { useContext, useEffect } from "react"
import { MainContext } from "../store/MainContextWrapper"
import { CartItem } from "./Cart"

const CheckoutCart = () => {

    const { state: { userId, accessToken, cart }, dispatch } = useContext(MainContext);
    const navigate = useNavigate();

    const TAX_RATE = 0.05;

    const getProduct = async (id: number) => {
        try {
            const response = await fetch('http://localhost:3000/product/' + id);
            const responseJson = await response.json();
            return responseJson[0];
        }
        catch {
            console.log('Error getting product')
        }
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
            console.log('Error getting cart')
        }
    };

    useEffect(() => {
        getCart(userId, dispatch);
    }, []);

    const calculateTotal = () => {
        try {
            return cart?.map((cartItem: CartItem) => cartItem.price * cartItem.quantity).reduce((previousPrice: number, currentPrice: number) => {
                return previousPrice + currentPrice;
            }, 0);
        }
        catch {
            console.log('Error calculating total');
        }
    };

    let PRE_TOTAL = 0;
    let TAX = 0;
    let TOTAL = 0;

    try {
        PRE_TOTAL = calculateTotal();
        TAX = PRE_TOTAL! * TAX_RATE;
        TOTAL = PRE_TOTAL! + TAX;
    }
    catch {
        console.log('Error calculating cost');
    }

    const submitOrder = async (dummyCardNumber: number) => {

        const orderItems = cart?.map((cartItem: CartItem) => {
            const { _id: productId, ...rest } = cartItem;
            return {
                productId,
                ...rest
            };
        })

        const body = {
            productList: orderItems,
            dummyCardNumber
        };

        console.log('debugg', body);

        const response = await fetch('http://localhost:3000/cart/' + userId, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        return await response.json();
    }

    const submitCheckoutCartForm = async (e: any) => {
        const dummyCardNumber = e?.target?.parentNode?.parentNode?.querySelector('#payment-card-input').value.split(' ').join('');

        if (dummyCardNumber) {
            const order = await submitOrder(dummyCardNumber);
            console.log('debugg', order);

            dispatch({
                type: 'setOrder',
                state: {
                    order
                }
            });

            return navigate('/order-confirmation');
        }
    }

    const PaymentDialog = () => {        

        return (
            <>
                <h2 className="checkout-cart-form-title">Payment information</h2>
                <Form action='#' className='checkout-cart-form'>
                    <div>
                        <label htmlFor="payment-name-input">
                            Name as on card:
                        </label>
                        <input id="payment-name-input" type="text" />
                    </div>
                    <div>
                        <label htmlFor="payment-address-input">
                            Address:
                        </label>
                        <input id="payment-address-input" type="text" />
                    </div>
                    <div>
                        <label htmlFor="payment-card-input">
                            Dummy card number:
                        </label>
                        <input id="payment-card-input" type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength={19} placeholder="xxxx xxxx xxxx xxxx" required/>
                    </div>
                    <div>
                        <label htmlFor="payment-card-expiration-date-input">
                            Expiration date:
                        </label>
                        <input id="payment-card-expiration-date-input" type="text" />
                    </div>
                    <div>
                        <label htmlFor="payment-card-ccv-input">CCV:</label>
                        <input id="payment-card-ccv-input" type="text" />
                    </div>
                    <div>
                        <input type="submit" value="Submit order" onClick={submitCheckoutCartForm} />
                    </div>
                </Form>
            </>
        )
    }

    return (
        <>
            <NavBar/>
            <div className="cart-table-div-container">            
            {/* <div> */}
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
                                <td>{cartItem.quantity}</td>
                                <td>${(cartItem.price * cartItem.quantity)?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="cart-table-aggregation-table">
                    <tbody>
                        <tr>
                            <td>Subtotal</td>
                            <td>${PRE_TOTAL > 0 ? PRE_TOTAL?.toFixed(2) : 0}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>${TAX > 0 ? TAX?.toFixed(2) : 0}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>${TOTAL ? TOTAL?.toFixed(2) : 0}</td>
                        </tr>
                    </tbody>
                </table>
            <PaymentDialog/>
            </div>
        </>
    )
}

export default CheckoutCart;