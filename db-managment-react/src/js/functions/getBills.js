import Bill from "../classes/Bills.js"

async function fetchBillDataByCustomerId(id) {
    const response = await fetch("http://localhost:3000/Bill?customerId="+id,{
        method: "GET",
        headers: {
            authorization: localStorage.getItem('access_token')
        }
    });
    return await response.json();
}

async function fetchCustomerDataById(id) {
    const response = await fetch("http://localhost:3000/Customers/" + id);
    return await response.json();
}

async function fetchSellerDataById(id) {
    const response = await fetch("http://localhost:3000/Seller/" + id, {
        method: "GET",
        headers: {
            authorization: localStorage.getItem('access_token')
        }
    });
    return await response.json();
}

async function fetchCreditCardDataById(id) {
    const response = await fetch("http://localhost:3000/CreditCard/" + id, {
        method: "GET",
        headers: {
            authorization: localStorage.getItem('access_token')
        }
    });
    return await response.json();
}

export async function getBills(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const bill_data = fetchBillDataByCustomerId(id);
    const customer_data = fetchCustomerDataById(id);
    const seller_data = fetchSellerDataById(id);
    const credit_card_data = fetchCreditCardDataById(id);

    const bills = []

    for (let bill in bill_data) {
        bills.push(
            new Bill(
                bill.id,
                bill.date,
                bill.billNumber,
                customer_data,
                seller_data,
                credit_card_data,
                bill.comment,
                bill.total
            )
        )
    }

    return bills;
}