export async function addBill(billData) {
    const response = await fetch("http://localhost:3000/Bill", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(billData)
    });
    if (!response.ok) throw new Error("Failed to create bill");
    return await response.json();
}