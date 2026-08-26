export async function deleteItem(id) {
    const response = await fetch(`http://localhost:3000/Item/`+id,{
        method: "DELETE",
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });

    if (!response.ok) throw new Error("Failed to delete item");
}