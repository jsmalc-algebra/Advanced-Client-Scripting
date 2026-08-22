import { useState, useEffect } from "react";
import {fillBillForeignKeys} from "../js/functions/fillBillForeignKeys.js";
import {formatCustomerText,formatCreditCardText,formatSellerText} from "../js/utils/billFormatters.js";
import {addBill} from "../js/functions/addBill.js";
import {useNavigate} from "react-router-dom";

export default function BillsForm() {
    const navigate = useNavigate();
    const customerId = new URLSearchParams(window.location.search).get('CustomerId');

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

    function handleChange(field) {
        return (e) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        try {
            await addBill(formData);
            navigate("/bills?id="+customerId);
        } catch (err) {
            console.error("Failed to add bill. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
            <div className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-center text-slate-800 mb-6">
                    Add Bill
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

                    {/* Seller */}
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
                            {sellers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Credit card */}
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
                            {creditCards.map((cc) => (
                                <option key={cc.id} value={cc.id}>
                                    {formatCreditCardText(cc)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Comment */}
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

                    {/* Total */}
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
                        {submitting ? "Adding…" : "Add Invoice"}
                    </button>
                </form>
            </div>
    );
}