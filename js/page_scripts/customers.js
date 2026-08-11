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
       return state.sortOrder === 'desc' ? -result : result;
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

async function pageChange() {
    let data_customers = await getAllCustomers();
    let data_cities = await getAllCities();
    let customers = makeCustomerArray(data_customers, data_cities);
    populateCustomerTable(customers);
}

page_limiter.addEventListener('change', (event) => {
    state.limit = event.target.value;
    console.log(event.target.value);
    pageChange()
        .catch(error => console.error(error));
})

pageChange()
    .catch(error => console.error(error));