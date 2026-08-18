export default class Bills {
    constructor(id, date, billNumber,customer_data,seller_data,creditCard_data,comment,total) {
        this.id = id;
        this.date = new Date(date).toLocaleDateString("en-GB");
        this.billNumber = billNumber;
        this.customerName = customer_data.name
        this.customerSurname = customer_data.surname
        this.sellerName = seller_data.name
        this.sellerSurname = seller_data.surname

        if (creditCard_data === "NOT ON RECORD") {this.cardExpired = creditCard_data}
        else {this.cardExpired = this.isCardExpired(creditCard_data)}

        this.comment = comment
        this.total = Math.round(total*100)/100
    }

    isCardExpired(card_data) {
        if (card_data.expirationYear < new Date().getFullYear()) {
            return "EXPIRED";
        }
        else if (card_data.expirationYear === new Date().getFullYear()) {
            if (card_data.expirationMonth <= new Date().getMonth()+1) {
                return "EXPIRED";
            } else { return "VALID"}
        }
        else {
            return "VALID";
        }
    }
}