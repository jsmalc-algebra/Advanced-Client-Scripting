export async function getBillById(id) {
   console.log("getBillById", id);

    const response = await fetch(`http://localhost:3000/Bill/`+id,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        }
    })
    return await response.json();
}

export async function updateBill(billData, billId) {
    const response = await fetch(`http://localhost:3000/Bill/${billId}`,{
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData)
    })
    console.log("Updated Bill", billData, " to ", await response.json()," with response: ",response)
}