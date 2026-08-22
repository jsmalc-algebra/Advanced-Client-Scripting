import fetchCustomerDataById from "./getBills.js";

export default async function fillBillForeignKeys() {

    const customerId = new URLSearchParams(window.location.search).get('id');

    const customer_data = await fetchCustomerDataById(customerId);

    const all_seller_data = await fetchAllSellers();

    const all_credit_card_data = await fetchAllCreditCards();

    const customer_name = `${customer_data.id} - ${customer_data.name} ${customer_data.surname}`

    let sellers = [];

    let creditCards = [];

    for (let seller of all_seller_data) {
        const seller_name = `${seller.id} - ${seller.name} ${seller.surname}`
        sellers.push(seller_name);
    }

    for (let card of all_credit_card_data) {
        const card_public_numbers = card.cardNumber.slice(-4);
        const card_public = `${card.id} - ${card_public_numbers} [${card.expirationMonth}/${card.expirationYear}]`
        creditCards.push(card_public);
    }

    return {customer_name, sellers, creditCards};
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