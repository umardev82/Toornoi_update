import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      console.log("Payment Method ID:", paymentMethod.id);
      setLoading(false);
      // Send paymentMethod.id to your Django API for processing
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Card Number
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardNumberElement className="w-full" />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Expiry Date
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardExpiryElement className="w-full" />
            </div>
          </div>

          {/* CVC Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">CVC</label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardCvcElement className="w-full" />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
