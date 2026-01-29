import React from "react";
import Invoices from "./compoents/invoices";
import Invoice from "./compoents/invoice";

export default function App(props) {
  // Get route from props (e.g., { route: '/invoices' } or { route: '/invoice/:id' })
  const route = props?.route || props?.path || '/invoices';
  
  // Route matching logic
  if (route === '/invoices' || route.startsWith('/invoices')) {
    return <Invoices {...props} />;
  }
  
  if (route === '/invoice' || route.startsWith('/invoice/')) {
    // Extract invoice ID from route if present (e.g., '/invoice/168648000000747001')
    const invoiceId = route.split('/invoice/')[1] || props?.invoiceId || props?.invoice_id;
    return <Invoice {...props} invoiceId={invoiceId} />;
  }
  
  // Default to invoices list
  return <Invoices {...props} />;
}

