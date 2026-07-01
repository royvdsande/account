// Generic account app configuration

const BINAS_CONFIG = {
  version: "1.0.0",
  copyright: "2026 Account",
  showCredit: false,

  authDomain: "account.binas.app",
  primaryAdmin: "mail@royvds.nl",
  enableBinasPlus: true,

  stripePriceId: "price_1TDM6gLzjWXxGtsSmBBGHvnY",

  plans: [
    {
      id: "plus",
      name: "Starter",
      desc: "Basic account features.",
      monthlyPrice: "4,99",
      yearlyPrice: "3,99",
      yearlyTotal: "47,99",
      monthlyPriceId: "price_1TDM6gLzjWXxGtsSmBBGHvnY",
      yearlyPriceId: "price_1TDMJ5LzjWXxGtsSYaGkzu7c",
      popular: false,
      features: ["Basic account access", "Standard support", "Monthly billing"],
    },
    {
      id: "pro",
      name: "Pro",
      desc: "More account features and priority support.",
      monthlyPrice: "9,00",
      yearlyPrice: "7,20",
      yearlyTotal: "86,40",
      monthlyPriceId: "price_1TDM7zLzjWXxGtsSSjb4tnbS",
      yearlyPriceId: "price_1TDMLbLzjWXxGtsS87kmPljA",
      popular: true,
      features: ["Everything in Starter", "Priority support", "Plan management"],
    },
    {
      id: "ultimate",
      name: "Business",
      desc: "Higher-touch support for billing and account needs.",
      monthlyPrice: "49,99",
      yearlyPrice: "39,99",
      yearlyTotal: "479,88",
      monthlyPriceId: "price_1TDM8YLzjWXxGtsSOlI0joem",
      yearlyPriceId: "price_1TDMMiLzjWXxGtsSOjYwRXfP",
      popular: false,
      features: ["Everything in Pro", "Dedicated support", "Flexible billing help"],
    },
  ],
};

if (typeof window !== "undefined") {
  window.BINAS_CONFIG = BINAS_CONFIG;
}

export default BINAS_CONFIG;
