const Receipt = {

    create(cart, customer, paymentMethod, totals) {

        const invoiceNumber =
            "INV-" +
            new Date()
                .toISOString()
                .replace(/\D/g, "")
                .slice(0, 14);


        return {

            invoiceNumber,

            date:
                new Date().toLocaleString(
                    "en-LK"
                ),

            store: {
                id: "001",
                name: "SUPER MART",
                address: "Colombo, Sri Lanka"
            },

            register: "04",

            cashier: "Kasun Perera",

            customer: customer
                ? {
                    id: customer.id,
                    name: customer.name,
                    tier: customer.tier,
                    points: customer.points
                }
                : null,

            items: cart.map(item => ({
                name: item.name,
                barcode: item.barcode,
                quantity: item.qty,
                unitPrice: item.price,
                total:
                    item.price * item.qty
            })),

            subtotal: totals.subtotal,

            discount: totals.discount,

            total: totals.total,

            payment: {
                method: paymentMethod
            }
        };
    },


    print(receipt) {

        const items =
            receipt.items
                .map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>
                            Rs.
                            ${item.total.toLocaleString(
                                "en-LK",
                                {
                                    minimumFractionDigits: 2
                                }
                            )}
                        </td>
                    </tr>
                `)
                .join("");


        const html = `

<!DOCTYPE html>

<html>

<head>

<title>${receipt.invoiceNumber}</title>

<style>

body {
    font-family: Arial, sans-serif;
    width: 320px;
    margin: 20px auto;
    color: #222;
}

h1 {
    text-align: center;
    font-size: 22px;
    margin-bottom: 3px;
}

.center {
    text-align: center;
}

.small {
    font-size: 11px;
    color: #666;
}

hr {
    border: 0;
    border-top: 1px dashed #999;
    margin: 14px 0;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
}

th,
td {
    padding: 5px 0;
    text-align: left;
}

th:last-child,
td:last-child {
    text-align: right;
}

.total {
    font-size: 17px;
    font-weight: bold;
}

.footer {
    text-align: center;
    margin-top: 20px;
    font-size: 11px;
}

</style>

</head>

<body>

<h1>SUPER MART</h1>

<div class="center small">
    ${receipt.store.address}
</div>

<hr>

<div class="small">
Invoice: ${receipt.invoiceNumber}<br>
Date: ${receipt.date}<br>
Cashier: ${receipt.cashier}<br>
Register: ${receipt.register}
</div>

<hr>

<table>

<thead>

<tr>
<th>Item</th>
<th>Qty</th>
<th>Total</th>
</tr>

</thead>

<tbody>

${items}

</tbody>

</table>

<hr>

<table>

<tr>
<td>Subtotal</td>
<td></td>
<td>
Rs. ${receipt.subtotal.toLocaleString(
    "en-LK",
    { minimumFractionDigits: 2 }
)}
</td>
</tr>

<tr>
<td>Discount</td>
<td></td>
<td>
- Rs. ${receipt.discount.toLocaleString(
    "en-LK",
    { minimumFractionDigits: 2 }
)}
</td>
</tr>

<tr class="total">
<td>Total</td>
<td></td>
<td>
Rs. ${receipt.total.toLocaleString(
    "en-LK",
    { minimumFractionDigits: 2 }
)}
</td>
</tr>

</table>

<hr>

<div class="small">

Payment: ${receipt.payment.method}

</div>

<div class="footer">

Thank you for shopping with us!<br>
Please visit again.

</div>

<script>
window.onload = () => window.print();
</script>

</body>

</html>
`;


        const receiptWindow =
            window.open(
                "",
                "_blank",
                "width=400,height=700"
            );


        receiptWindow.document.write(html);

        receiptWindow.document.close();
    }
};