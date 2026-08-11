import Customer from '../entities/Customer.js'

let state = {
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: 'asc',
}

const page_limiter = document.getElementById('pageSize')

async function getAllCities() {
    const response = await fetch('http://localhost:3000/City');
    return await response.json();
}

async function getAllCustomers() {
    const params = new URLSearchParams({
        '_page': state.page.toString(),
        '_limit': state.limit.toString()
    });

    if (state.sortBy && state.sortBy !== 'City') {
        params.append('_sort',state.sortBy)
        params.append('_order', state.sortOrder)
    }

    const response = await fetch(`http://localhost:3000/Customer?${params}`); // Technically a template literal
    console.log(params)
    console.log(response)
    return await response.json()
}

function makeCustomerArray(data_customers,data_cities) {
    const customers = []

    for (let i = 0; i < data_customers.length; i += 1) {
        let customer_data = data_customers[i]

        let name = customer_data.name;
        let surname = customer_data.surname;
        let email = customer_data.email;
        let phoneNumber = customer_data.telephone;
        let city = customer_data.cityId;

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

async function populatePaginationNav() {
    const pagination_nav = document.getElementById('pagination')

    const response = await fetch('http://localhost:3000/Customer?_start=20&_end=30');
    const total_count = Number(response.headers.get('x-total-count'));
    const page_num = Math.ceil(total_count / state.limit);

    const page_numbers = [];
    page_numbers.push(1)
    if (state.page > 2) {page_numbers.push(state.page -1)}
    if (state.page !== 1) {page_numbers.push(state.page)}
    if (state.page !== page_num && state.page +1 !== page_num) {page_numbers.push(state.page+1)}
    page_numbers.push(page_num);

    pagination_nav.innerHTML = `
        <li class="page-item ${state.page === 1 ? "disabled" : ""}" id="prev-page">
            <button class="page-link" type="button" aria-label="Previous page">
              Prev
            </button>
        </li>
    `

    page_numbers.forEach((page_number) => {
        const li = document.createElement('li');

        li.className="page-item page-number";
        if (page_number === state.page) {li.classList.add('active');}

        li.innerHTML = `<button class="page-link" type="button" data-page="${page_number}">${page_number}</button>`;

        pagination_nav.appendChild(li);
    })

    pagination_nav.insertAdjacentHTML('beforeend', `
    <li class="page-item ${state.page === page_num ? "disabled" : ""}" id="next-page">
        <button class="page-link" type="button" aria-label="Next page">
            Next
        </button>
    </li>
    `);
}

async function pageChange() {
    let data_customers = await getAllCustomers();
    let data_cities = await getAllCities();
    let customers = makeCustomerArray(data_customers, data_cities);
    if (state.sortBy === 'City') {sortCustomersByCity(customers)}
    populateCustomerTable(customers);
    await populatePaginationNav();
}

page_limiter.addEventListener('change', (event) => {
    state.limit = event.target.value;
    console.log(event.target.value);
    pageChange()
        .catch(error => console.error(error));
})

pageChange()
    .catch(error => console.error(error));