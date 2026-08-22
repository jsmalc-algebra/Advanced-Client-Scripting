import {fetchCustomerDataById} from "./getBills.js";

export async function fillBillForeignKeys(customerId) {

    const customer_data = await fetchCustomerDataById(customerId);

    const all_seller_data = await fetchAllSellers();

    const all_credit_card_data = await fetchAllCreditCards();

    return {customer_data,all_seller_data,all_credit_card_data};
}

async function fetchAllSellers(){
    const request = await fetch("http://localhost:3000/Seller",{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })

    return await request.json();
}

async function fetchAllCreditCards(){
    const request = await fetch("http://localhost:3000/CreditCard",{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    return await request.json();
}