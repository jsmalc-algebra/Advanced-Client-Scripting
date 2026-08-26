import {fetchBIllById} from "./getBillItems.js";

export async function fillItemForeignKeys(billId) {
    const bill_data = await fetchBIllById(billId);

    const product_data = await fetchAllProducts();

    return {bill_data, product_data};
}

async function fetchAllProducts() {
    const request = await fetch("http://localhost:3000/Product",{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })

    return await request.json();
}