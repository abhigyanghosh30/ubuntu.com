import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UserSubscriptionMarketplace } from "advantage/api/enum";
import Checkout from "advantage/subscribe/checkout/components/Checkout";
import {
  Action,
  LoginSession,
  Product,
} from "advantage/subscribe/checkout/utils/types";

const oneHour = 1000 * 60 * 60;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: oneHour,
      retryOnMount: false,
    },
  },
});

Sentry.init({
  dsn: "https://0293bb7fc3104e56bafd2422e155790c@sentry.is.canonical.com//13",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["ubuntu.com"],
    }),
  ],
  allowUrls: ["ubuntu.com"],
  tracesSampleRate: 1.0,
});

declare global {
  interface Window {
    accountId?: string;
    stripePublishableKey?: string;
    loginSession?: LoginSession;
    marketplace: UserSubscriptionMarketplace;
    canTrial?: boolean;
    currentPaymentId: string;
    invoiceId: string;
    captcha: string | null;
    previousPurchaseIds?: { monthly: string; yearly: string };
    GAFriendlyProduct?: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    };
  }
}
const checkoutData = localStorage.getItem("shop-checkout-data") || "";
// console.log(checkoutData);
const parsedCheckoutData = JSON.parse(checkoutData);
// const parsedCheckoutData = {
//   product: {
//     id: "cue-activation-key",
//     longId: "lAMGrt4buzUR0-faJqg-Ot6dgNLn7ubIpWiyDgOrsDCg",
//     name: "CUE Activation Key",
//     price: { value: "4900", currency: "USD" },
//     period: "monthly",
//     productID: "cue-activation-key",
//     canBeTrialled: false,
//     private: "false",
//     marketplace: "canonical-ua",
//   },
//   quantity: 3,
//   action: "purchase",
// };
const stripePromise = loadStripe(window.stripePublishableKey || "");
const product: Product = parsedCheckoutData?.product;
const quantity: number = parsedCheckoutData?.quantity;
const action: Action = parsedCheckoutData?.action;
console.log(product, quantity, action);
window.previousPurchaseIds = {
  monthly: "",
  yearly: "",
};
window.canTrial = undefined;
window.currentPaymentId = "";
window.accountId = "";
window.captcha = null;

window.marketplace = product.marketplace;
window.GAFriendlyProduct = {
  id: product?.id,
  name: product?.name,
  price: (product?.price?.value ?? 0) / 100,
  quantity: quantity,
};

const CredCheckout = () => {
  return (
    <Sentry.ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <Checkout product={product} quantity={quantity} action={action} />
        </Elements>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};
export default CredCheckout;
