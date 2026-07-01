const BINAS_CONFIG = {
  authDomain: "account.binas.app",
  stripePriceId: "price_1TDM6gLzjWXxGtsSmBBGHvnY",
  plans: [
    {
      id: "plus",
      name: "Starter",
      monthlyPrice: "4,99",
      yearlyPrice: "3,99",
      monthlyPriceId: "price_1TDM6gLzjWXxGtsSmBBGHvnY",
      yearlyPriceId: "price_1TDMJ5LzjWXxGtsSYaGkzu7c",
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: "9,00",
      yearlyPrice: "7,20",
      monthlyPriceId: "price_1TDM7zLzjWXxGtsSSjb4tnbS",
      yearlyPriceId: "price_1TDMLbLzjWXxGtsS87kmPljA",
    },
    {
      id: "ultimate",
      name: "Business",
      monthlyPrice: "49,99",
      yearlyPrice: "39,99",
      monthlyPriceId: "price_1TDM8YLzjWXxGtsSOlI0joem",
      yearlyPriceId: "price_1TDMMiLzjWXxGtsSOjYwRXfP",
    },
  ],
};

if (typeof window !== "undefined") {
  window.BINAS_CONFIG = BINAS_CONFIG;
}

export default BINAS_CONFIG;
