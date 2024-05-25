import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const getProducts = async (setProducts: any) => {
    try {
        if (setProducts == null) {
            throw new Error('Error getting products. Missing parameter')
        }
    
        try {
            const response = await fetch('http://localhost:3000/product');
            const responseJson = await response.json();
            responseJson && setProducts(responseJson);
        }
        catch {
            throw new Error('Error getting products')
        }
    }
    catch (e: any) {
        throw new Error(e.message);
    }
}

export const getProductQuantity = async (productId: number) => {
    try {
        if (productId == null) {
            throw new Error("Product id cannot be null");
        }
        try {
            const response = await fetch('http://localhost:3000/product/' + productId + '/quantity');
            return await response.json();
        }
        catch {
            throw new Error("Error getting product quantity");
        }                
    }
    catch (e: any) {
        // console.log({ error: e.message });
        throw new Error(e.message);
    }
}

export const getQuantityOfProductInCart = async (userId: number, productId: number) => {
    try {
        if (userId == null || productId == null) {
            throw new Error('User id nor product id can be null')
        }

        try {
            const response = await fetch('http://localhost:3000/cart/' + userId + '/item/' + productId);
            const cartItem = await response.json();
            return cartItem[0]?.quantity;
        }
        catch {
            throw new Error("Error getting quantity of product in cart");
        }
    }
    catch (e: any) {
        // console.log({ error: e.message});
        throw new Error(e.message)
    }
}

export const isProductQuantityAvailable = (quantityOfProductInCart: number, quantityToAdd: number, productQuanityAvailable: number) => {
    try {
        if (quantityOfProductInCart == null || quantityToAdd == null || productQuanityAvailable == null) {
            // console.log('Missing required value(s)');
            throw new Error('Missing required value(s)')
        }
        return quantityOfProductInCart + quantityToAdd <= productQuanityAvailable;
    }
    catch (e: any) {
        throw new Error(e.message);
    }
}

export default function Products() {

    const [ products, setProducts ] = useState<any>([]);   
    
    useEffect(() => {
        getProducts(setProducts);
    }, []);

    const addToCart = async (e: any) => {
        interface addToCartRequestBody {
            userId: number,
            productId: number,
            quantity: number
        }

        const sendAddToCartRequest = async (body: addToCartRequestBody) => {
            try {
                if (body == null) {
                    throw new Error('Request body cannot be null')
                }

                try {
                    return await fetch(
                        'http://localhost:3000/cart/',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        }
                    )
                }
                catch {
                    throw new Error('Error adding to cart')
                }
            }
            catch (e: any) {
                throw new Error(e.message);
            }
        }

        try {
            const productId = Number(e.target.parentNode.querySelector('a').attributes['data-product-id'].value);
            const productQuanityAvailable = await getProductQuantity(productId)
            const userId = 1;
            const quantityOfProductInCart = await getQuantityOfProductInCart(userId, productId )

            if (!isProductQuantityAvailable(quantityOfProductInCart, 1, productQuanityAvailable)) {
                alert('Quantity not available');
                return;
            }

            const body: addToCartRequestBody= {
                userId,
                productId,
                quantity: 1
            }

            try {
                await sendAddToCartRequest(body);
                alert('Added to cart');
            }
            catch {
                throw new Error('Error adding to cart');
            }
        }
        catch (e: any) {
            console.log(e.message);
        }
    };

    return (
        <>
            <NavBar/>
            <div id="product">
                <h4 id="products-title">Products</h4>
                <ul className="product-ul">
                    {(products.length >=1) && (
                        products.map((product: any, i: any) => (                            
                            <li key={i}>
                                <Link to={"/product/" + product._id} className="product-a" data-product-id={product._id}>
                                    <img className="products-img" src={new URL("../assets/images/" + product?.imagePaths[0], import.meta.url).href} />                 
                                    <span className="product-name-and-price-span">
                                        <span className="product-name">{product?.name}</span>
                                        <span>${product?.price}</span>                                        
                                    </span>
                                </Link>
                                <button onClick={addToCart}>Add to cart</button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </>
    )
}