export default class Bills {
    constructor(id, date, billNumber,customer_data,seller_data,creditCard_data,comment,total) {
        this.id = id;
        this.date = new Date(date).toLocaleDateString("en-GB");
        this.billNumber = billNumber;
        this.customerName = customer_data.name
        this.customerSurname = customer_data.surname
        this.sellerName = seller_data.name
        this.sellerSurname = seller_data.surname

        if (creditCard_data === "NOT ON RECORD") {
            this.cardExpired = creditCard_data
            this.cardDate = null
        }
        else {
            console.log("Credit card data mismatch?", creditCard_data)
            this.cardExpired = this.isCardExpired(creditCard_data)
            this.cardDate =`${creditCard_data.expirationMonth}/${creditCard_data.expirationYear}`
            console.log("Credit card date mismatch?", this.cardDate)
        }

        this.comment = comment
        this.total = Math.round(total*100)/100
    }

    isCardExpired(card_data) {
        console.log(`${card_data.expirationYear} vs ${new Date().getFullYear()}`)
        if (card_data.expirationYear < new Date().getFullYear()) {
            console.log("EXPIRED")
            return "EXPIRED";
        }
        else if (card_data.expirationYear === new Date().getFullYear()) {
            console.log(`${card_data.expirationMonth} vs ${new Date().getMonth()+1}`)
            if (card_data.expirationMonth <= new Date().getMonth()+1) {
                console.log("EXPIRED")
                return "EXPIRED";
            } else {
                console.log("VALID")
                return "VALID"
            }
        }
        else {
            console.log("VALID")
            return "VALID";
        }
    }
}