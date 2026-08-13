import Customer from '../entities/Customer.js'

let state = {
    curr_page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    searchString: null,
    max_page: 20
}

const page_limiter = document.getElementById('pageSize')
const pagination_nav = document.getElementById('pagination')
const sorting_head = document.getElementById('sorting-head')
const search_button = document.getElementById('search-button')

async function getAllCities() {
    const response = await fetch('http://localhost:3000/City');
    return await response.json();
}

async function getAllCustomers() {
    const params = new URLSearchParams({
        '_page': state.curr_page.toString(),
        '_limit': state.limit.toString()
    });

    if (state.sortBy && state.sortBy !== 'city') {
        params.append('_sort',state.sortBy)
        params.append('_order', state.sortOrder)
    }

    let response;
    if (state.sortBy !== 'city' && state.searchString === null) {
        response = await fetch(`http://localhost:3000/Customer?${params}`); // Technically a template literal
        console.log(params)
        console.log(response)
    }
    else {response = await fetch(`http://localhost:3000/Customer`)}
    return await response.json()
}

function makeCustomerArray(data_customers,data_cities) {
    const customers = []

    for (let i = 0; i < data_customers.length; i += 1) {
        let customer_data = data_customers[i]


        // Destructuring
        let {
            name,
            surname,
            email,
            telephone: phoneNumber,
            cityId: city
        } = customer_data

        if (city) {
            city = data_cities.find(city_entity => city_entity.id === city).name;
        } else {
            city = "";
        }

        customers.push(
            new Customer(
                name,
                surname,
                email,
                phoneNumber,
                city
            )
        )
    }

    return customers;
}

// ES5 CODE, purposefully not using let or arrow functions
function sortCustomersByCity(customers) {
    return customers.sort(function (a, b) {
       var result = a.city.localeCompare(b.city);
       if (state.sortOrder === 'desc') {
           return -result;
       } else {return result;}
    });
}

function populateCustomerTable(customers) {
    const tbody = document.getElementById('table-body')

    tbody.innerHTML = "";

    customers.forEach((customer) => {
        const row = document.createElement('tr');

        row.innerHTML = ` 
             <td>${customer.name}</td> 
             <td>${customer.lastName}</td> 
             <td>${customer.email}</td> 
             <td>${customer.phoneNumber}</td> 
             <td>${customer.city}</td> 
        `; //More template literals

        tbody.appendChild(row);

    })
}

async function calculateMaxPage() {
    const response = await fetch('http://localhost:3000/Customer?_start=20&_end=30');
    const total_count = Number(response.headers.get('x-total-count'));
    state.max_page = Math.ceil(total_count / state.limit);

    if (state.curr_page > state.max_page) {state.curr_page=1}
}

function populatePaginationNav() {
    const max_page = state.max_page;
    const page_numbers = [];
    page_numbers.push(1)
    if (state.curr_page > 2) {page_numbers.push(state.curr_page -1)}
    if (state.curr_page !== 1) {page_numbers.push(state.curr_page)}
    if (state.curr_page !== max_page && state.curr_page +1 !== max_page) {page_numbers.push(state.curr_page+1)}
    if (max_page !== 1 && state.curr_page !== max_page) {page_numbers.push(max_page)}

    pagination_nav.innerHTML = `
        <li class="page-item ${state.curr_page === 1 ? "disabled" : ""}" id="prev-page">
            <button class="page-link" type="button" aria-label="Previous page">
              Prev
            </button>
        </li>
    `

    page_numbers.forEach((page_number) => {
        const li = document.createElement('li');

        li.className="page-item page-number";
        if (page_number === state.curr_page) {li.classList.add('active');}

        li.innerHTML = `<button class="page-link" type="button" data-page="${page_number}">${page_number}</button>`;

        pagination_nav.appendChild(li);
    })

    pagination_nav.insertAdjacentHTML('beforeend', `
    <li class="page-item ${state.curr_page === max_page ? "disabled" : ""}" id="next-page">
        <button class="page-link" type="button" aria-label="Next page">
            Next
        </button>
    </li>
    `);
}

// ES5 CODE, purposefully using var
function paginateCustomersArray(customers) {
    var start = (state.curr_page - 1) * state.limit;
    var end = start+state.limit;
    return customers.slice(start, end);
}

async function searchCustomerInfo() {
    let response = await fetch(`http://localhost:3000/Customer?q=${state.searchString}`);
    const customer_data = await response.json();

    response = await fetch(`http://localhost:3000/City?q=${state.searchString}`);
    const cities_data = await response.json();

    return [customer_data, cities_data];
}

async function pageChange() {
    state.searchString = null;
    await calculateMaxPage();
    let data_customers = await getAllCustomers();
    let data_cities = await getAllCities();
    let customers = makeCustomerArray(data_customers, data_cities); // Uses destructuring
    if (state.sortBy === 'city') {
        customers = sortCustomersByCity(customers)
        customers = paginateCustomersArray(customers)
    } // Uses ES5 code
    populateCustomerTable(customers);
    populatePaginationNav();
}

async function searchPageChange() {
    let all_customer_data = await getAllCustomers();
    let all_city_data = await getAllCities();
}

page_limiter.addEventListener('change', (event) => {
    state.limit = event.target.value;
    pageChange()
        .catch(error => console.error(error));
})

pagination_nav.addEventListener('click', (event) => {
    const pageButton = event.target.closest('[data-page]');

    if (pageButton) {state.curr_page = Number(pageButton.dataset.page);}

    if (event.target.closest('#prev-page')) {state.curr_page = state.curr_page - 1}

    if (event.target.closest('#next-page')) {state.curr_page = state.curr_page + 1}

    pageChange()
        .catch(error => console.error(error));
});

sorting_head.addEventListener('click', (event) => {
    const categoryHeader = event.target.closest('[data-sort]');

    if (state.sortBy !== categoryHeader.dataset.sort) {
        state.sortOrder = null;
        state.sortBy = categoryHeader.dataset.sort;
    }

    if (state.sortOrder === null || state.sortOrder === 'desc') {state.sortOrder = 'asc'}
    else {state.sortOrder = 'desc'}

    pageChange()
        .catch(error => console.error(error));
})

search_button.addEventListener('click', (event) => {
    state.searchString = document.getElementById('searchInput').value
    searchPageChange()
         .catch(error => console.error(error));
})

pageChange()
    .catch(error => console.error(error));