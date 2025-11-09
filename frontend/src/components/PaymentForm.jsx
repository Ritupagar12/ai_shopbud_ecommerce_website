import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { toggleOrderStep } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const PaymentForm = () => {
  const clientSecret = useSelector((state) => state.order.paymentIntent);
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment Successful.");
      navigateTo("/");
    }

    setIsProcessing(false);
    dispatch(toggleOrderStep());
    dispatch(clearCart());
  };

  return (
    <form className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md dark:shadow-lg space-y-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Card Payment</h2>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details *
        </label>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
          <CardElement options={{ style: { base: { fontSize: "16px", color: "#111827" } } }} />
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-2 p-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-300">
        <Lock className="w-5 h-5 text-green-500" />
        <span className="text-sm">Your card information is encrypted and secure.</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex justify-center items-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          "Complete Payment"
        )}
      </button>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </form>
  );
};

export default PaymentForm;