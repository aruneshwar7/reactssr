import React, { useState } from "react";

export default function Invoice(props) {
    // Get invoice ID from props (could be from route params)
    const invoiceId = props?.invoiceId || props?.invoice_id;
    
    // Find the invoice by ID from invoices list if available, or use the invoice prop
    const findInvoiceById = () => {
        if (props?.invoice) {
            return props.invoice;
        }
        if (invoiceId && props?.invoices && Array.isArray(props.invoices)) {
            return props.invoices.find(inv => inv.invoice_id === invoiceId || inv.invoice_id === String(invoiceId));
        }
        return null;
    };
    
    const initialInvoice = findInvoiceById();
    const [add, setAdd] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [invoice, setInvoice] = useState(initialInvoice);
    const [editedData, setEditedData] = useState({
        customer_name: initialInvoice?.customer_name || '',
        reference_number: initialInvoice?.reference_number || '',
        date: initialInvoice?.date || '',
        due_date: initialInvoice?.due_date || '',
        total: initialInvoice?.total || 0,
        status: initialInvoice?.status || 'draft'
    });
    
    if (!invoice) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1 style={{ color: '#dc3545', marginBottom: '10px' }}>Invoice Not Found</h1>
            <p style={{ color: '#666' }}>The invoice you're looking for doesn't exist.</p>
        </div>;
    }
    
    const handleEdit = () => {
        setIsEditing(true);
    };
    
    const handleCancel = () => {
        setEditedData({
            customer_name: invoice.customer_name || '',
            reference_number: invoice.reference_number || '',
            date: invoice.date || '',
            due_date: invoice.due_date || '',
            total: invoice.total || 0,
            status: invoice.status || 'draft'
        });
        setIsEditing(false);
    };
    
    const handleSave = () => {
        // Update invoice with edited data
        const updatedInvoice = {
            ...invoice,
            customer_name: editedData.customer_name,
            reference_number: editedData.reference_number,
            date: editedData.date,
            due_date: editedData.due_date,
            total: editedData.total,
            status: editedData.status,
            status_formatted: editedData.status.charAt(0).toUpperCase() + editedData.status.slice(1),
            date_formatted: formatDate(editedData.date),
            due_date_formatted: formatDate(editedData.due_date),
            total_formatted: `₹${parseFloat(editedData.total).toFixed(2)}`,
            last_modified_time: new Date().toISOString()
        };
        setInvoice(updatedInvoice);
        setIsEditing(false);
        // In a real app, you would make an API call here to save the changes
        console.log('Saving invoice:', updatedInvoice);
    };
    
    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };
    
    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    };
    
    const headerStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '25px 30px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    
    const cardStyle = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        border: '1px solid #e9ecef'
    };
    
    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        marginLeft: '10px'
    };
    
    const primaryButton = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };
    
    const successButton = {
        ...buttonStyle,
        backgroundColor: '#28a745',
        color: 'white'
    };
    
    const dangerButton = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };
    
    const secondaryButton = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        color: 'white'
    };
    
    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        fontSize: '14px',
        marginTop: '5px',
        boxSizing: 'border-box'
    };
    
    const labelStyle = {
        display: 'block',
        marginBottom: '15px',
        color: '#495057',
        fontSize: '14px'
    };
    
    const statusBadgeStyle = {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        backgroundColor: invoice.status === 'draft' ? '#ffc107' : invoice.status === 'sent' ? '#17a2b8' : '#28a745',
        color: invoice.status === 'draft' ? '#000' : '#fff'
    };
    
    return <div style={containerStyle}>
        <div style={headerStyle}>
            <div>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{invoice.invoice_number}</h1>
                <div style={statusBadgeStyle}>{invoice.status_formatted}</div>
            </div>
            <div>
                {!isEditing ? (
                    <button onClick={handleEdit} style={primaryButton} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
                        ✏️ Edit Invoice
                    </button>
                ) : (
                    <>
                        <button onClick={handleSave} style={successButton} onMouseOver={(e) => e.target.style.backgroundColor = '#218838'} onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}>
                            💾 Save Changes
                        </button>
                        <button onClick={handleCancel} style={secondaryButton} onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'} onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}>
                            ❌ Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={cardStyle}>
                <h3 style={{ marginTop: '0', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Invoice Information</h3>
                {isEditing ? (
                    <>
                        <label style={labelStyle}>
                            <strong>Date:</strong>
                            <input 
                                type="date" 
                                value={editedData.date} 
                                onChange={(e) => handleChange('date', e.target.value)}
                                style={inputStyle}
                            />
                        </label>
                        <label style={labelStyle}>
                            <strong>Due Date:</strong>
                            <input 
                                type="date" 
                                value={editedData.due_date} 
                                onChange={(e) => handleChange('due_date', e.target.value)}
                                style={inputStyle}
                            />
                        </label>
                        <label style={labelStyle}>
                            <strong>Order Number:</strong>
                            <input 
                                type="text" 
                                value={editedData.reference_number} 
                                onChange={(e) => handleChange('reference_number', e.target.value)}
                                style={inputStyle}
                                placeholder="Enter order number"
                            />
                        </label>
                    </>
                ) : (
                    <>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Date:</strong> <span style={{ color: '#212529' }}>{invoice.date_formatted}</span></p>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Due Date:</strong> <span style={{ color: '#212529' }}>{invoice.due_date_formatted}</span></p>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Order Number:</strong> <span style={{ color: '#212529' }}>{invoice.reference_number || 'N/A'}</span></p>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Type:</strong> <span style={{ color: '#212529' }}>{invoice.type_formatted}</span></p>
                    </>
                )}
            </div>
            
            <div style={cardStyle}>
                <h3 style={{ marginTop: '0', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Customer Information</h3>
                {isEditing ? (
                    <>
                        <label style={labelStyle}>
                            <strong>Customer Name:</strong>
                            <input 
                                type="text" 
                                value={editedData.customer_name} 
                                onChange={(e) => handleChange('customer_name', e.target.value)}
                                style={inputStyle}
                                placeholder="Enter customer name"
                            />
                        </label>
                        <p style={{ marginBottom: '12px', color: '#6c757d' }}><strong>Customer ID:</strong> <span style={{ color: '#212529' }}>{invoice.customer_id}</span></p>
                    </>
                ) : (
                    <>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Customer Name:</strong> <span style={{ color: '#212529' }}>{invoice.customer_name}</span></p>
                        <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Customer ID:</strong> <span style={{ color: '#212529' }}>{invoice.customer_id}</span></p>
                    </>
                )}
            </div>
        </div>
        
        <div style={cardStyle}>
            <h3 style={{ marginTop: '0', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Financial Details</h3>
            {isEditing ? (
                <>
                    <label style={labelStyle}>
                        <strong>Total Amount (₹):</strong>
                        <input 
                            type="number" 
                            step="0.01"
                            value={editedData.total} 
                            onChange={(e) => handleChange('total', parseFloat(e.target.value) || 0)}
                            style={inputStyle}
                            placeholder="Enter total amount"
                        />
                    </label>
                    <label style={labelStyle}>
                        <strong>Status:</strong>
                        <select 
                            value={editedData.status} 
                            onChange={(e) => handleChange('status', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </label>
                     </>
            ) : (
                <>
                    <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Total Amount:</strong> <span style={{ color: '#212529', fontSize: '18px', fontWeight: '600' }}>{invoice.total_formatted}</span></p>
                    <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Balance Due:</strong> <span style={{ color: '#212529', fontSize: '18px', fontWeight: '600' }}>{invoice.balance_formatted}</span></p>
                    <p style={{ marginBottom: '12px' }}><strong style={{ color: '#6c757d' }}>Unprocessed Payment:</strong> <span style={{ color: '#212529' }}>{invoice.unprocessed_payment_amount_formatted}</span></p>
                </>
            )}
        </div>
        
       
        <>
        <h1>Add</h1>
        <button onClick={() => setAdd(add + 1)}>Add</button>
        <h1>{add}</h1>
    </>
    </div>;

   
}

