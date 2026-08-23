import { useState, useEffect } from "react";
import {fillBillForeignKeys} from "../js/functions/fillBillForeignKeys.js";
import {formatCustomerText,formatCreditCardText,formatSellerText} from "../js/utils/billFormatters.js";
import {addBill} from "../js/functions/addBill.js";
import {useNavigate, useParams} from "react-router-dom";
import {getBillById, updateBill} from "../js/functions/BillEditingFunctions.js";

export default function BillsForm() {
    const navigate = useNavigate();
    const {customerId, id} = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        date: "",
        billNumber: "",
        customerId: "",
        sellerId: "",
        creditCardId: "",
        comment: "",
        total: "",
    });

    const [customer, setCustomer] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [creditCards, setCreditCards] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loadingBill, setLoadingBill] = useState(isEditMode);


    useEffect(() => {
        let cancelled = false;

        fillBillForeignKeys(customerId)
            .then(({ customer_data, all_seller_data, all_credit_card_data }) => {
                if (cancelled) return;
                setCustomer(customer_data);
                setSellers(all_seller_data);
                setCreditCards(all_credit_card_data);
                setFormData(prev => ({ ...prev, customerId: String(customer_data.id) }));
            })
            .finally(() => {
                if (!cancelled) setLoadingOptions(false);
            });

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!isEditMode) {return;}

        let cancelled = false;

       getBillById(id).then((bill) => {
           console.log("Bill gotten via ID: ",bill)
           if (cancelled) return;
            setFormData({
                date: bill.date.split('T')[0],
                billNumber: bill.billNumber,
                customerId: String(bill.customerId),
                sellerId: String(bill.sellerId),
                creditCardId: String(bill.creditCardId ?? ""),
                comment: bill.comment ?? "",
                total: String(bill.total),
            });
        }) .finally(() => {
            if (!cancelled) setLoadingBill(false);
        });

        return () => { cancelled = true;};
        }, [isEditMode,id])

    function handleChange(field) {
        return (e) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        try {
            if (!isEditMode) {await addBill(formData);}
            else {await updateBill(formData,id)}
            navigate(`/customers/${customerId}/bills`);
        } catch (err) {
            if (!isEditMode) {console.error("Failed to add bill. Please try again.");}
            else {console.error("Failed to update bill. Please try again")}
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
            <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-center text-slate-800 mb-6">
                    {isEditMode ? "Update Bill" : "Add Bill"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                            Date
                        </label>
                        <input
                            id="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleChange("date")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="billNumber" className="block text-sm font-medium text-slate-700 mb-1">
                            Bill number
                        </label>
                        <input
                            id="billNumber"
                            type="text"
                            placeholder="e.g. 2026-0001"
                            required
                            value={formData.billNumber}
                            onChange={handleChange("billNumber")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                    </div>


                    <div>
                        <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 mb-1">
                            Customer
                        </label>
                        <p className="w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                            {loadingOptions ? "Loading customer…" : formatCustomerText(customer)}
                        </p>
                    </div>


                    <div>
                        <label htmlFor="sellerId" className="block text-sm font-medium text-slate-700 mb-1">
                            Seller
                        </label>
                        <select
                            id="sellerId"
                            required
                            disabled={loadingOptions}
                            value={formData.sellerId}
                            onChange={handleChange("sellerId")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
                        >
                            <option value="" disabled>
                                {loadingOptions ? "Loading sellers…" : "Select a seller"}
                            </option>
                            {sellers.map((seller) => (
                                <option key={seller.id} value={seller.id}>
                                    {formatSellerText(seller)}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label htmlFor="creditCardId" className="block text-sm font-medium text-slate-700 mb-1">
                            Credit card
                        </label>
                        <select
                            id="creditCardId"
                            required
                            disabled={loadingOptions}
                            value={formData.creditCardId}
                            onChange={handleChange("creditCardId")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
                        >
                            <option value="" disabled>
                                {loadingOptions ? "Loading credit cards…" : "Select a credit card"}
                            </option>
                            <option value={null}>
                               null - Leave empty
                            </option>
                            {creditCards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {formatCreditCardText(card)}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">
                            Comment
                        </label>
                        <input
                            id="comment"
                            type="text"
                            placeholder="Optional note"
                            value={formData.comment}
                            onChange={handleChange("comment")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                    </div>


                    <div>
                        <label htmlFor="total" className="block text-sm font-medium text-slate-700 mb-1">
                            Total
                        </label>
                        <input
                            id="total"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                            value={formData.total}
                            onChange={handleChange("total")}
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || loadingOptions}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded transition-colors"
                    >
                        {isEditMode ? "Edit Bill" : "Add Bill"}
                    </button>
                </form>
            </div>
    );
}