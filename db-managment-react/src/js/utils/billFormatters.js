export function formatSellerText(seller) {
    return `${seller.id} - ${seller.name} ${seller.surname}`;
}

export function formatCreditCardText(card) {
    const lastFour = card.cardNumber.slice(-4);
    return `${card.id} - ${lastFour} [${card.expirationMonth}/${card.expirationYear}]`;
}

export function formatCustomerText(customer) {
    return `${customer.id} - ${customer.name} ${customer.surname}`;
}