
import React from "react";

export default function Invoices(props) {   
    const invoices = props.invoices;
    const navigate = (path) => {
        window.location.href = path;
    }
    return <div>
        <h1>Invoices</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd', width: '60px', minWidth: '60px' }}>
                        <input type="checkbox" aria-label="Select all rows" />
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Date
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Invoice#
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Order Number
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Customer Name
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Status
                    </th>
                    <th style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                        Due Date
                    </th>
                    <th style={{ textAlign: 'end', padding: '8px', border: '1px solid #ddd' }}>
                        Amount
                    </th>
                    <th style={{ textAlign: 'end', padding: '8px', border: '1px solid #ddd', width: '197px' }}>
                        Balance Due
                    </th>
                    <th style={{ textAlign: 'center', padding: '8px', border: '1px solid #ddd', width: '4%' }}>
                        <button type="button" aria-label="Advanced Search" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            🔍
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.invoice_id} onClick={() => navigate(`/invoices/1`)}>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            <input type="checkbox" aria-label="Select row" />
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.date_formatted}
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.invoice_number}
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.reference_number || '-'}
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.customer_name}
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.status_formatted}
                        </td>
                        <td style={{ textAlign: 'start', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.due_date_formatted}
                        </td>
                        <td style={{ textAlign: 'end', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.total_formatted}
                        </td>
                        <td style={{ textAlign: 'end', padding: '8px', border: '1px solid #ddd' }}>
                            {invoice.balance_formatted}
                        </td>
                        <td style={{ textAlign: 'center', padding: '8px', border: '1px solid #ddd' }}>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
