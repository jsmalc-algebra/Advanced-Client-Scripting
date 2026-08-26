export default class Item {
    constructor(item_data,bill_data,product_data,subcategory_data,category_data) {
        this.id = item_data.id;
        this.quantity = item_data.quantity;
        this.totalPrice = Math.round(item_data.totalPrice*100)/100;
        this.billNumber = bill_data.billNumber;
        this.productName = product_data.name;
        this.productColor = product_data.color;
        this.productPrice = product_data.price;
        this.category = `${category_data.name} - ${subcategory_data.name}`;
        console.debug("New Item: ",this)
    }
}