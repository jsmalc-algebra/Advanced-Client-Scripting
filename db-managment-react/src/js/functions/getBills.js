import Bill from "../classes/Bills.js"

const LOCAL_SORT_FIELDS = ['customer','seller','creditCardStatus']

function sortBillArray(bill_array, sortBy, sortOrder) {
    return bill_array.sort(function (a, b) {
        let result;
        if (sortBy === 'customer') {result = a.customerName.localeCompare(b.customerName);}
        else if (sortBy === 'seller') {result = a.sellerName.localeCompare(b.sellerName);}
        else {result = a.cardExpired.localeCompare(b.cardExpired);}

        if (sortOrder === 'desc') {return -result;}
        else {return result;}
    })
}

function paginateBillArray(bill_array, currentPage, limit) {
    const start = (currentPage-1) * limit;
    const end = start + limit;
    return bill_array.slice(start, end);
}

async function fetchPaginatedBillDataByCustomerId(id,page,limit, sortBy, sortOrder) {
    const params = new URLSearchParams({_page:page,_limit:limit,customerId:id});

    if (sortBy) {
        params.append('_sort', sortBy)
        params.append('_order', sortOrder)
    }

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

export async function getBills(page,limit,sortBy,sortOrder) {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('id');

    let bill_data;
    let totalCount;

    if(sortBy && !LOCAL_SORT_FIELDS.includes(sortBy)){
       ( {data:bill_data,totalCount:totalCount} = await fetchPaginatedBillDataByCustomerId(customerId,page,limit,sortBy,sortOrder));
    } else {
        let bill_response = await fetch(`http://localhost:3000/Bill?customerId=`+customerId)
        bill_data = await bill_response.json();

        bill_response = await fetch(`http://localhost:3000/Bill?=_page=2&_limit=10&customerId=`+customerId);
        totalCount = Number(bill_response.headers.get('x-total-count'));
    }


    const customer_data = await fetchCustomerDataById(customerId);


    let items = []

    for (let bill of bill_data) {
        const seller_data = await fetchSellerDataById(bill.sellerId);

        let credit_card_data;

        if (bill.creditCardId) {credit_card_data = await fetchCreditCardDataById(bill.creditCardId);}
        else {credit_card_data = "NOT ON RECORD"}

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

    if (sortBy && LOCAL_SORT_FIELDS.includes(sortBy)) {
        items = sortBillArray(items, sortBy, sortOrder);
        items = paginateBillArray(items, page, limit);
    }

    return {items, totalCount};
}