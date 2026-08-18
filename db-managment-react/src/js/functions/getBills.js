import Bill from "../classes/Bills.js"

async function fetchPaginatedBillDataByCustomerId(id,page,limit) {
    const params = new URLSearchParams({_page:page,_limit:limit,customerId:id});
    const response = await fetch(`http://localhost:3000/Bill?${params}`,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const data = await response.json();
    const totalCount = Number(response.headers.get('x-total-count'));
    return {data, totalCount}
}

async function fetchCustomerDataById(id) {
    const response = await fetch("http://localhost:3000/Customer/" + id);
    return await response.json();
}

async function fetchSellerDataById(id) {
    const response = await fetch("http://localhost:3000/Seller/" + id, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return await response.json();
}

async function fetchCreditCardDataById(id) {
    const response = await fetch("http://localhost:3000/CreditCard/" + id, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return await response.json();
}

export async function getBills(){
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('id');

    const {data:bill_data,totalCount:totalCount} = await fetchPaginatedBillDataByCustomerId(customerId);
    const customer_data = await fetchCustomerDataById(customerId);


    const items = []

    for (let bill of bill_data) {
        const seller_data = await fetchSellerDataById(bill.sellerId);

        let credit_card_data;

        if (bill.creditCardId) {credit_card_data = await fetchCreditCardDataById(bill.creditCardId);}
        else {credit_card_data = "NOT ON FILE"}

        items.push(
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

    return {items, totalCount};
}