import Bill from "../classes/Bills.js"

const LOCAL_SORT_FIELDS = ['customer','seller','creditCardStatus']

async function itemizeBills(bill_data, customer_data) {
    let itemizedBills = []

    for (let bill of bill_data) {
        const seller_data = await fetchSellerDataById(bill.sellerId);

        let credit_card_data;

        if (bill.creditCardId) {
            credit_card_data = await fetchCreditCardDataById(bill.creditCardId);
        } else {
            credit_card_data = "NOT ON RECORD"
        }

        itemizedBills.push(
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

    return itemizedBills
}

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

async function fetchPaginatedBillDataByCustomerId(id,page,limit, sortBy, sortOrder,searchString) {
    const params = new URLSearchParams({_page:page,_limit:limit,customerId:id});

    if (sortBy) {
        params.append('_sort', sortBy)
        params.append('_order', sortOrder)
    }

    else if (searchString) {
        params.append('q', searchString)
    }

    console.debug("Params: " + JSON.stringify(params))
    console.debug("SortBy status: " + sortBy);

    const response = await fetch(`http://localhost:3000/Bill?${params}`,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const data = await response.json();

    console.debug("Bill data using API search: ", data)

    const totalCount = Number(response.headers.get('x-total-count'));
    return {data, totalCount}
}

async function fetchCustomerDataById(id) {
    const response = await fetch("http://localhost:3000/Customer/" + id);
    return await response.json();
}

async function fetchSellerDataById(id,searchString) {
    const response = await fetch(`http://localhost:3000/Seller/${id}${searchString ? `?q=${searchString}` : ''}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return await response.json();
}

async function fetchCreditCardDataById(id,searchString) {
    const response = await fetch(`http://localhost:3000/CreditCard/${id}${searchString ? `?q=${searchString}` : ''}` ,{
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

    if(sortBy === null || !LOCAL_SORT_FIELDS.includes(sortBy)){
        console.debug("using regular function");
        ( {data:bill_data,totalCount:totalCount} = await fetchPaginatedBillDataByCustomerId(customerId,page,limit,sortBy,sortOrder));
    } else {
        console.debug("using local sort function");
        let bill_response = await fetch(`http://localhost:3000/Bill?customerId=`+customerId,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        bill_data = await bill_response.json();

        console.debug("bill data using local sort fetch: ", bill_data)

        bill_response = await fetch(`http://localhost:3000/Bill?=_page=2&_limit=10&customerId=`+customerId, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        totalCount = Number(bill_response.headers.get('x-total-count'));
    }


    const customer_data = await fetchCustomerDataById(customerId);

    console.debug("bill data: ", bill_data)
    let items = itemizeBills(bill_data,customer_data);

    if (sortBy && LOCAL_SORT_FIELDS.includes(sortBy)) {
        items = sortBillArray(items, sortBy, sortOrder);
        items = paginateBillArray(items, page, limit);
    }

    return {items, totalCount};
}

export async function searchBills(CustomerId,page,limit,searchString) {
    let searched_bill_data;
    let totalCount;


    ({data:searched_bill_data,totalCount:totalCount} = fetchPaginatedBillDataByCustomerId(CustomerId,page,limit,undefined,undefined,searchString));
    const customer_data = await fetchCustomerDataById(CustomerId);

    let items = itemizeBills(searched_bill_data,customer_data);
    let item_ids = new Set(items.map((item) => item.id));

    let searched_sellers_data = await fetchSellerDataById(CustomerId,searchString);

    for (let seller in searched_sellers_data) {
        const bill_response = await fetch(`http://localhost:3000/Bill?sellerId=${seller.id}`,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        const bill_data = await bill_response.json();

        if (item_ids.has(bill_data.id)) {continue;}

        else {item_ids.add(bill_data.id);}

        let credit_card_data;

        if (bill_data.creditCardId) {
            credit_card_data = await fetchCreditCardDataById(bill_data.creditCardId);
        } else {
            credit_card_data = "NOT ON RECORD"
        }

        items.push(
            new Bill(
                bill_data.id,
                bill_data.date,
                bill_data.billNumber,
                customer_data,
                seller,
                credit_card_data,
                bill_data.comment,
                bill_data.total
            )
        );
    }

    let searched_credit_card_data = await fetchCreditCardDataById(CustomerId,searchString);

    for (let creditCard in searched_credit_card_data) {
        const bill_response = await fetch(`http://localhost:3000/Bill?creditCardId=${creditCard.id}`,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        const bill_data = await bill_response.json();

        if (item_ids.has(bill_data.id)) {continue;}
        else {item_ids.add(bill_data.id);}

        let seller_data = await fetchSellerDataById(bill_data.sellerId);

        items.push(
            new Bill(
            bill_data.id,
            bill_data.date,
            bill_data.billNumber,
            customer_data,
            seller_data,
            creditCard,
            bill_data.comment,
            bill_data.total
            )
        );
    }

    items = paginateBillArray(items, page, limit);

    return {items, totalCount};
}