import {getAllCities} from "../reusable-functions.js"

const citySelect = document.getElementById('city');

async function populateCityDropdown(){
    const city_response = await getAllCities();

    const option = document.createElement("option");
    option.value = null;
    option.text = "null - None"
    citySelect.appendChild(option);

    city_response.forEach(city =>{
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = `${city.id} - ${city.name}`;
        citySelect.appendChild(option);
    });
}

async function makeNewCustomer(){
    const params ={
        'name': document.getElementById('firstName').value,
        'surname': document.getElementById('lastName').value,
        'email': document.getElementById('email').value,
        'telephone': document.getElementById('phone').value,
        'cityId': document.getElementById('city').value,
    }
    console.log(params);
    const response = await fetch(`http://localhost:3000/Customer`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(params),
    });

    if (response.ok){
        const data = await response.json();
        const id = data.id;
        window.location.href = "customer-detail.html?id=" + id;
    } else {
        throw new Error('Adding failed.');
    }




}

document.querySelector("#addCustomerForm").addEventListener("submit", async event => {
    event.preventDefault();
    makeNewCustomer().catch(
        error => {
            if (error.message === 'Adding failed.') {alert('Adding failed. Contact tech support')}
            else {console.error(error)}
        }
    )
})

populateCityDropdown()
    .catch(error => {
        console.error(error);});

