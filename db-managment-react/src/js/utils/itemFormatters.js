export function formatBillText(bill) {
    return `${bill.id} - ${bill.billNumber}`
}

export function formatProductText(product) {
    return `${product.id} - ${product.name} - ${product.price} €`
}