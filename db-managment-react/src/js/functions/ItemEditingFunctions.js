export async function getItemById(id) {
    const response = await fetch(`http://localhost:3000/Item/`+id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    return await response.json();
}

export async function updateItem(itemData, itemId) {
    const response = await fetch(`http://localhost:3000/Item/${itemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    })
}