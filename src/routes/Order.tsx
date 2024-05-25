import { useContext } from "react";
import { MainContext } from "../store/MainContextWrapper";
import NavBar from "./NavBar";

export const Order = () => {

    var { state: { order } } = useContext(MainContext);
    
    return (
        <>
            <NavBar/>
            <h3 id="order-confirmation-table-title">Order confirmation</h3>
            <table id="order-confirmation-table">
                <thead>
                    <tr id="order-table-head-row">
                        <th>Account id</th>
                        <th>Order id</th>
                        <th>Subtotal</th>
                        <th>Tax</th>
                        <th>Total</th>
                        <th>State</th>
                        <th>Date created</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        order[0] &&
                        <tr id="order-table-data-row">
                            <td>{order[0]?.userId}</td>
                            <td>{order[0]?.id}</td>
                            <td>${Number(order[0]?.preTotal)?.toFixed(2)}</td>
                            <td>${Number(order[0]?.preTotal * order[0]?.tax)?.toFixed(2)}</td>
                            <td>${Number(order[0]?.total)?.toFixed(2)}</td>
                            <td>{order[0]?.state}</td>
                            <td>{order[0]?.createdAt}</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    );
}