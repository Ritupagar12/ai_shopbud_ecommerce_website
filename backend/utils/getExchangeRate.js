import fetch from "node-fetch";

export const getUsdToNzdRate = async () => {
  try {
    const res = await fetch(process.env.EXCHANGE_API);
    const data = await res.json();

    if (!data || !data.conversion_rates || !data.conversion_rates.NZD) {
      console.log("NZD rate not found:", data);
      return 1; // fallback
    }

    return data.conversion_rates.NZD;
  } catch (error) {
    console.log("Error fetching exchange rate:", error);
    return 1; // fallback
  }
};