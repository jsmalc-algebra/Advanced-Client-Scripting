import {getAllCities} from "./customers"

const citySelect = document.getElementById('city');

async function populateCityDropdown(){
    const city_response = await getAllCities();

    city_response.forEach(city =>{
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

async function findCityByNameAndReturnId(name){
    const response = await fetch(`http://localhost:3000/City/?name=${name}`);
    const data = await response.json();
    return data.id;
}

async function makeNewCustomer(name,last_name,email,phone,city_name){
    const city_id = await findCityByNameAndReturnId(city_name);
    const params ={
        'name': name,
        'surname': last_name,
        'email': email,
        'telephone': phone,
        'cityId': city_id,
    }
    const response = await fetch(`http://localhost:3000/Customer?`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(params),
    });

    const data = await response.json();
    const id = data.id;

    window.location.href = "customer-detail.html?id=" + id;
}

document.querySelector("#addCustomerForm").addEventListener("submit", async event => {
    event.preventDefault();
    makeNewCustomer().catch(
        error => {console.error(error)}
    )
})

populateCityDropdown()
    .catch(error => {
        console.error(error);});

