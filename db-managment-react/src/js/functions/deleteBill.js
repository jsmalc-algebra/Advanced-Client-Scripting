export async function deleteBill(id) {
   const response = await fetch("http://localhost:3000/Bill/"+id,{
        method: "DELETE",
        headers :{
            "Authorization": "Bearer " + localStorage.getItem("access_token")
        }
    });

    if (!response.ok) throw new Error("Failed to delete bill");
}