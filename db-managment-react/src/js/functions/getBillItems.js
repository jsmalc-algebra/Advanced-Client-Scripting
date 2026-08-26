import Item from "../classes/Items.js";
import {paginateArray} from "./paginateArray.js";

const LOCAL_SORT_FIELDS=['billNumber','productName','productColor','productPrice','category']

async function fetchPaginatedItemDataByBillId(id, page,limit, sortBy, sortOrder,searchString) {
    console.log("id: ",id);
    const params = new URLSearchParams({_page:page,_limit:limit,billId:id});

    if (sortBy) {
        params.append('_sort', sortBy)
        params.append('_order', sortOrder)
    }

    else if (searchString) {
        params.append('q', searchString)
    }

    console.log("Params: ",params.toString())

    const response = await fetch(`http://localhost:3000/Item?${params}`,{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    const data = await response.json();

    const totalCount = Number(response.headers.get('x-total-count'));
    return {data, totalCount}
}

export async function fetchBIllById(id) {
    const response = await fetch(`http://localhost:3000/Bill/${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return await response.json();
}

async function fetchProductById(id) {
    const response = await fetch(`http://localhost:3000/Product/${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return await response.json();
}

async function fetchSubcategoryById(id) {
    const response = await fetch(`http://localhost:3000/SubCategory/${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return await response.json();
}

async function fetchCategoryById(id) {
    const response = await fetch(`http://localhost:3000/Category/${id}`, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return await response.json();
}

async function itemizeItems(item_data,bill_data){
    let itemizedItems = [];
    for (let item of item_data) {
        console.log("Item: ",item);
        const product_data = await fetchProductById(item.productId);
        const subcategory_data = await fetchSubcategoryById(product_data.subCategoryId);
        const category_data = await fetchCategoryById(subcategory_data.categoryId);

        itemizedItems.push(
            new Item(item,bill_data,product_data,subcategory_data,category_data)
        )

    }

    return itemizedItems;
}

function sortItemArray(item_array,sortBy,sortOrder){
    return item_array.sort(function(a,b) {
        let result;
        if (sortBy === 'billNumber') {result = a.billNumber.localeCompare(b.billNumber);}
        else if (sortBy === 'productName') {result = a.productName.localeCompare(b.productName);}
        else if (sortBy === 'productColor') {result = a.productColor.localeCompare(b.productColor);}
        else if (sortBy === 'productPrice') {result = a.productPrice.localeCompare(b.productPrice);}
        else {result = a.category.localeCompare(b.category);}

        if (sortOrder === 'desc') {return -result;}
        else {return result;}
    })
}

export async function getItems(page,limit,sortBy,sortOrder,searchString,billId) {
    let item_data,totalCount

    console.log("getItemsId ",billId)

    if(sortBy === null || !LOCAL_SORT_FIELDS.includes(sortBy)){
        console.debug("using regular function");
        ({data:item_data,totalCount} = await fetchPaginatedItemDataByBillId(billId,page,limit,sortBy,sortOrder,searchString));
    } else {
        console.debug("using local sort function");
        let response = await fetch(`http://localhost:3000/Item?billId=`+billId,{
            method:"GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        item_data = await response.json();
        totalCount = item_data.length;
    }

    const bill_data = await fetchBIllById(billId);

    let items = await itemizeItems(item_data,bill_data);

    if (sortBy && LOCAL_SORT_FIELDS.includes(sortBy)){
        items = sortItemArray(items,sortBy,sortOrder);
        items = paginateArray(items, page, limit);
    }

    return {items,totalCount}
}

export async function searchItems(){
    //TODO: Implement
}