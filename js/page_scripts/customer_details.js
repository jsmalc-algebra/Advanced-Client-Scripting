async function getCustomerDataById(id){
    const response = await fetch("http://localhost:3000/Customer/"+id);
    return await response.json();
}

async function getCityNameById(id){
    const response = await fetch("http://localhost:3000/City/"+id);
    const data = await response.json();
    return data.name;
}

function populateDetailsPage(customer_data,city_name){
    document.getElementById("detail-name").value = customer_data.name;
    document.getElementById("detail-surname").value = customer_data.surname;
    document.getElementById("detail-email").value = customer_data.email;
    document.getElementById("detail-telephone").value = customer_data.telephone;
    document.getElementById("detail-city").value = city_name;
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
}

initPage()
    .catch((error) => {
        console.error(error);});