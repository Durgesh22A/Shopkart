const razorpay = {
    orders: {
        create: async ({ amount, currency, receipt }) => {
            const keyId = process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            if (!keyId || !keySecret) {
                throw new Error("Razorpay keys are not configured on the server");
            }

            const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
            const response = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${authorization}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount, currency, receipt })
            });
            const data = await response.json();
            if (response.status === 401) {
                throw new Error("Razorpay authentication failed. Generate a new Test Mode Key ID and Key Secret in the Razorpay Dashboard, then update server/.env.local and restart the server.");
            }
            if (!response.ok) throw new Error(data.error?.description || "Unable to create Razorpay order");
            return data;
        }
    }
};

export default razorpay;
