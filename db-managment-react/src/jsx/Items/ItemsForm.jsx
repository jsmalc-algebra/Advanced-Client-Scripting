import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fillItemForeignKeys} from "../../js/functions/fillItemForeignKeys.js";
import {getItemById, updateItem} from "../../js/functions/ItemEditingFunctions.js";
import {addItem} from "../../js/functions/addItem.js";
import {formatBillText, formatProductText} from "../../js/utils/itemFormatters.js";

export default function ItemsForm() {
    const navigate = useNavigate();
    const {billId, id} = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        billId: "",
        quantity: "",
        productId: "",
        totalPrice: "",
    });

    const [bill, setBill] = useState(null);
    const [products, setProducts] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loadingItem, setLoadingItem] = useState(isEditMode);

    useEffect(() => {
        let cancelled = false;

        fillItemForeignKeys(billId)
            .then(({ bill_data, product_data }) => {
                if (cancelled) return;
                setBill(bill_data);
                setProducts(product_data);
                setFormData(prev => ({ ...prev, billId: String(bill_data.id) }));
            })
            .finally(() => {
                if (!cancelled) setLoadingOptions(false);
            });

        return () => { cancelled = true; };
    }, [billId]);

    // Load existing item in edit mode
    useEffect(() => {
        if (!isEditMode) {return;}

        let cancelled = false;

        getItemById(id).then((item) => {
            if (cancelled) return;
            setFormData({
                billId: String(item.billId),
                quantity: String(item.quantity),
                productId: String(item.productId),
                totalPrice: String(item.totalPrice),
            });
        }).finally(() => {
            if (!cancelled) setLoadingItem(false);
        });

        return () => { cancelled = true; };
    }, [isEditMode, id]);

    // Recalculate totalPrice whenever quantity or productId changes.
    // Null-safe: both productId and quantity must be set, the product must
    // actually be found, and its price must be a valid number, before we compute.
    useEffect(() => {
        if (formData.productId === "" || formData.quantity === "") {
            return;
        }

        const selectedProduct = products.find(p => String(p.id) === formData.productId);
        if (!selectedProduct) {
            return;
        }

        const price = Number(selectedProduct.price);
        const quantity = Number(formData.quantity);
        if (Number.isNaN(price) || Number.isNaN(quantity)) {
            return;
        }

        setFormData(prev => ({ ...prev, totalPrice: String(price * quantity) }));
    }, [formData.quantity, formData.productId, products]);

    function handleChange(field) {
        return (e) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        try {
            if (!isEditMode) {await addItem(formData);}
            else {await updateItem(formData, id)}
            navigate(`/bills/${billId}/items`);
        } catch (err) {
            if (!isEditMode) {console.error("Failed to add bill item. Please try again.");}
            else {console.error("Failed to update bill item. Please try again");}
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-center text-slate-800 mb-6">
                {isEditMode ? "Update Bill Item" : "Add Bill Item"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label htmlFor="billId" className="block text-sm font-medium text-slate-700 mb-1">
                        Bill
                    </label>
                    <p className="w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        {loadingOptions ? "Loading bill…" : formatBillText(bill)}
                    </p>
                </div>

                <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-slate-700 mb-1">
                        Product
                    </label>
                    <select
                        id="productId"
                        required
                        disabled={loadingOptions}
                        value={formData.productId}
                        onChange={handleChange("productId")}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
                    >
                        <option value="" disabled>
                            {loadingOptions ? "Loading products…" : "Select a product"}
                        </option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {formatProductText(product)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
                        Quantity
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        inputMode="numeric"
                        step="1"
                        min="0"
                        placeholder="0"
                        required
                        value={formData.quantity}
                        onChange={handleChange("quantity")}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                </div>

                <div>
                    <label htmlFor="totalPrice" className="block text-sm font-medium text-slate-700 mb-1">
                        Total Price
                    </label>
                    <input
                        id="totalPrice"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled
                        value={formData.totalPrice}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-slate-100 text-slate-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || loadingOptions}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded transition-colors"
                >
                    {isEditMode ? "Edit Bill Item" : "Add Bill Item"}
                </button>
            </form>
        </div>
    );
}