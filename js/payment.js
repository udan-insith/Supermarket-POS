const Payments = {

    methods: [
        "Cash",
        "Card",
        "QR"
    ],


    calculateChange(total, received) {

        return Math.max(
            0,
            received - total
        );
    },


    validate(method, total, received = 0) {

        if (!method) {

            return {
                valid: false,
                message: "Select a payment method"
            };
        }


        if (method === "Cash") {

            if (received < total) {

                return {
                    valid: false,
                    message: "Insufficient cash"
                };
            }
        }


        return {
            valid: true
        };
    }
};