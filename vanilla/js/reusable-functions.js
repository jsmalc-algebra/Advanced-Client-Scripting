export async function getAllCities() {
    const response = await fetch('http://localhost:3000/City');
    return await response.json();
}

export async function getCustomerDataById(id){
    const response = await fetch("http://localhost:3000/Customer/"+id);
    return await response.json();
}