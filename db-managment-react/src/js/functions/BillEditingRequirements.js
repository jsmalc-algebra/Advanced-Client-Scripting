export async function getBillById(id) {
    const response = await fetch(`http://localhost:3000/Bill/`+id,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
    })
    return await response.json();
}