export async function addItem(itemData) {
    const response = await fetch(`http://localhost:3000/Item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(itemData)
    });

    if (!response.ok) {
        throw new Error("Failed to create item");
    }
    return await response.json();
}