import {getCustomerDataById} from "../reusable-functions.js"

async function getCityNameById(id){
    const response = await fetch("http://localhost:3000/City/"+id);
    const data = await response.json();
    return data.name;
}

function populateDetailsPage(customer_data,city_name){
    document.getElementById("detail-name").textContent = customer_data.name;
    document.getElementById("detail-surname").textContent = customer_data.surname;
    document.getElementById("detail-email").textContent = customer_data.email;
    document.getElementById("detail-telephone").textContent = customer_data.telephone;
    document.getElementById("detail-city").textContent = city_name;
}

function makeIdBackedButtons(id){
    const div=document.getElementById("button-links")

    div.innerHTML=`
        <a href="edit-customer.html?id=${id}" type="button" class="btn btn-outline-primary" id="editBtn">Edit</a>
        <a href="delete-customer.html?id=${id}" type="button" class="btn btn-outline-danger" id="deleteBtn">Delete</a>
    `
}

async function initPage(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const customer_data = await getCustomerDataById(id);
    let cityName;
    if(customer_data.cityId){
        cityName = await getCityNameById(customer_data.cityId);
    } else {cityName=''}

    console.log(customer_data)
    populateDetailsPage(customer_data,cityName);
    makeIdBackedButtons(id);
}

initPage()
    .catch((error) => {
        console.error(error);});