import {getAllCities,getCustomerDataById} from "../reusable-functions.js";

const citySelect = document.getElementById('city');


async function populateCityDropdownPreselected(id){
    const city_response = await getAllCities();

    const option = document.createElement("option");
    option.value = null;
    option.text = "null - None"
    if(id === null) {option.selected = true}
    citySelect.appendChild(option);

    city_response.forEach(city =>{
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = `${city.id} - ${city.name}`;
        if(city.id === id){option.selected = true;}
        citySelect.appendChild(option);
    });
}

function populateEditPageTextFields(customer_data){
    document.getElementById('id').value = customer_data.id;
    document.getElementById('firstName').value = customer_data.name;
    document.getElementById('lastName').value = customer_data.surname;
    document.getElementById('email').value = customer_data.email;
    document.getElementById('phone').value = customer_data.telephone;
}

async function populateEditCustomer() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const customer_data = await getCustomerDataById(id);

    populateEditPageTextFields(customer_data);
    await populateCityDropdownPreselected(customer_data.cityId);
}


async function editCustomer(){
    const params ={
        'name': document.getElementById('firstName').value,
        'surname': document.getElementById('lastName').value,
        'email': document.getElementById('email').value,
        'telephone': document.getElementById('phone').value,
        'cityId': document.getElementById('city').value,
    }

    console.log(params);
    const customer_id = document.getElementById('id').value
    const response = await fetch(`http://localhost:3000/Customer/${customer_id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(params),
    });

    if(!response.ok){
        throw new Error('Editing failed.');
    } else { window.location.href = "customer-detail.html?id=" + customer_id;}
}

document.querySelector("#editCustomerForm").addEventListener("submit", async event => {
    event.preventDefault();
    editCustomer().catch(
        error => {
            if (error.message === 'Editing failed.') {alert('Adding failed. Contact tech support')}
            else {console.error(error)}
        }
    )
})

populateEditCustomer()
    .catch(error => {console.error(error)});