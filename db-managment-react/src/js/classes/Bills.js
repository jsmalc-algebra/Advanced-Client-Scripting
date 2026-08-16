export default class Bills {
    constructor(id, date, billNumber,customer_data,seller_data,creditCard_data,comment,total) {
        this.id = id;
        this.date = new Date(date);
        this.billNumber = billNumber;
        this.customerName = customer_data.name
        this.customerSurname = customer_data.surname
        this.sellerName = seller_data.name
        this.sellerSurname = seller_data.surname
        this.cardExpired = this.isCardExpired(creditCard_data)
        this.comment = comment
        this.total = total
    }

    isCardExpired(card_data) {
        if (card_data.expirationYear < new Date().getFullYear()) {
            return true
        }
        else if (card_data.expirationYear === new Date().getFullYear()) {
            return card_data.expirationMonth > new Date().getMonth();
        }
    }
}