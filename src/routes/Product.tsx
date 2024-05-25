import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";

export const getProduct = async (setProduct:  any, productId: string) => {
    try {
        if (setProduct == null || productId == null) {
            throw new Error('Error getting product. Missing required parameter(s)')
        }
    
        try {
            const response = await fetch('http://localhost:3000/product/' + productId);
            const responseJson = await response.json();
            setProduct(responseJson);
        }
        catch {
            throw new Error('Error getting product')
        }
    }
    catch (e: any) {
        throw new Error(e.message);
    }
}

export const getProductQuantity = async (productId: string) => {
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

export const getQuantityOfProductInCart = async (userId: number, productId: string) => {
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

export default function Product() {

    const [product, setProduct] = useState<any>([]);
    const { id: productId }  = useParams(); // product id

    useEffect(() => {
        try {
            getProduct(setProduct, productId as string);
            console.log('debugg', productId);
        }
        catch (e: any) {
            alert(e.message);
        }
    }, []);

    const addToCart = async (e: any) => {
        interface addToCartRequestBody {
            userId: number,
            productId: string,
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
            const productQuanityAvailable = await getProductQuantity(productId as string); 

            const userId = 1;
            const quantityOfProductInCart = await getQuantityOfProductInCart(userId as number, productId as string)

            const quantityToAdd = e.target.parentNode.querySelector('input').value;
            if (!isProductQuantityAvailable(quantityOfProductInCart, quantityToAdd, productQuanityAvailable)) {
                alert('Quantity not available'); 
                return;
            }

            const body: addToCartRequestBody = {
                userId,
                productId: productId as string,
                quantity: quantityToAdd
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

    return(
        <>
            <NavBar/>
            <div className="clicked-product">
                {   
                    Array.isArray(product) && product.length >= 1 && 
                        <>
                            <div className="product-img-div">
                                <img src={new URL('../assets/images/' + product[0].imagePaths[0], import.meta.url).href} alt="Error loading image..." data-product-id={product[0]._id}/>
                            </div>
                            <div className="product-div-2">
                                <h1 className="product-div-2-child">{product[0].name}</h1>
                                <h2 className="product-div-2-child">${product[0].price}</h2>
                                {/* <label ca */}
                                {/* <select id="quantity-select" name="quantity-select">
                                    {
                                        [...Array(31)].map(
                                            (_e: any, i: any) => (
                                                <option key={i} value={i}>{i}</option>
                                            )
                                        )
                                    }
                                </select> */}
                                <span className="product-div-2-child">
                                    <input type="number" defaultValue={1} pattern="[0-9]{0,3}" min={0} max={30}/>
                                    <button onClick={addToCart}>Add to cart</button>
                                </span>
                                <div className="product-div-2-child">
                                    <h3 id="product-description-title">Description</h3>
                                    <p id="product-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum corporis.
                                    </p>
                                </div>
                            </div>
                        </>
                    
                }
            </div>
        </>
    );
}