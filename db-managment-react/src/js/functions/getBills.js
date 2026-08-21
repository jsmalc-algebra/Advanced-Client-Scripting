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
    const response = await fetch(`http://localhost:3000/Seller/${id}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return await response.json();
}

async function fetchCreditCardDataById(id) {
    const response = await fetch(`http://localhost:3000/CreditCard/${id}` ,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return await response.json();
}

export async function getBills(page, limit, sortBy, sortOrder, searchString) {
    console.log("getBills called");

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

        totalCount = bill_data.length;
    }


    const customer_data = await fetchCustomerDataById(customerId);

    console.debug("bill data: ", bill_data)
    let items = await itemizeBills(bill_data,customer_data);

    if (sortBy && LOCAL_SORT_FIELDS.includes(sortBy)) {
        items = sortBillArray(items, sortBy, sortOrder);
        items = paginateBillArray(items, page, limit);
    }

    return {items, totalCount};
}

export async function searchBills(page, limit, sortBy, sortOrder, searchString) {
    console.log("searchBills called");

    let searched_bill_data;
    let full_bill_data;
    let totalCount;

    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('id');


    ({data:searched_bill_data,totalCount:totalCount} = await fetchPaginatedBillDataByCustomerId(customerId,page,limit,undefined,undefined,searchString));
    const customer_data = await fetchCustomerDataById(customerId);

    console.log("searched bill data: ",searched_bill_data);

    ({data:full_bill_data} = await fetchPaginatedBillDataByCustomerId(customerId,page,limit,undefined,undefined,undefined));
    let items = await itemizeBills(searched_bill_data,customer_data);
    let all_items = await itemizeBills(full_bill_data,customer_data);

    let item_ids = new Set(items.map((item) => item.id));
    let all_item_leftovers = all_items.filter((item) => !item_ids.has(item.id));

    if (all_item_leftovers.length === 0) {
        return {items, totalCount};
    }


    let response = await fetch(`http://localhost:3000/Seller?q=${searchString}`,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    console.debug("Seller searched response: ",response);
    const searched_sellers_data = await response.json();

    console.log("searched sellers data: ", searched_sellers_data);

    for (let seller of searched_sellers_data) {

        console.log(seller);

        if (all_item_leftovers.every(item => item.seller_id !== seller.id)) {
            console.table(all_item_leftovers);
            console.log("Above table DOES NOT include: ",seller.id);
            continue;
        }
        else {
            console.table(all_item_leftovers);
            console.log("Above table DOES include: ",seller.id);
        }

        let request = await fetch(`http://localhost:3000/Bill?customerId=${customerId}&sellerId=${seller.id}`,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        console.log("Broken request?",request);
        const bill_data = await request.json();

        items.push(...await itemizeBills(bill_data,customer_data));
    }

     response  = await fetch(`http://localhost:3000/CreditCard?q=${searchString}`,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const searched_credit_card_data = await response.json();
    console.log("searched_credit_card_data: ",searched_credit_card_data);

    for (let creditCard of searched_credit_card_data) {
        if (all_item_leftovers.every(item => item.card_id!== creditCard.id)) {continue;}

        const bill_response = await fetch(`http://localhost:3000/Bill?creditCardId=${creditCard.id}`,{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        const bill_data = await bill_response.json();

        items.push(...await itemizeBills(bill_data, customer_data));
    }

    item_ids = new Set();
    items = items.filter((item) => {
        if (item_ids.has(item.id)) {
            return false;
        }

        item_ids.add(item.id);
        return true;
    })

    items = paginateBillArray(items, page, limit);

    return {items, totalCount};
}