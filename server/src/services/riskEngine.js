// src/services/riskEngine.js

/**
 * Takes the formData from frontend and returns:
 * {
 *   riskProfile,        // "Conservative" | "Moderate" | "Aggressive"
 *   description,        // human readable summary
 *   allocation: {       // % allocation
 *     stocks,
 *     bonds,
 *     gold,
 *     cash
 *   },
 *   meta: {             // extra info if we need later
 *     score,
 *     factors: {...}
 *   }
 * }
 */

function calculateRiskProfile(formData) {
  const {
    age,
    income,
    emergencyFund,
    investmentHorizon,
    marketDropResponse,
    riskTolerance,
  } = formData;

  // ----- 1) Convert categorical answers → numeric sub-scores -----

  let score = 50; // base neutral score

  // Age (younger → more risk capacity)
  if (age === "18-25") score += 10;
  else if (age === "26-35") score += 8;
  else if (age === "36-45") score += 4;
  else if (age === "46-55") score += 1;
  else if (age === "55+") score -= 4;

  // Investment horizon (longer → more equity OK)
  if (investmentHorizon === "10+ years") score += 15;
  else if (investmentHorizon === "5-10 years" || investmentHorizon === "5-10 Years") score += 10;
  else if (investmentHorizon === "3-5 years") score += 5;
  else if (investmentHorizon === "1-3 years") score -= 5;

  // Emergency fund (no fund → reduce risk capacity)
  if (emergencyFund === "yes") score += 5;
  else if (emergencyFund === "no") score -= 10;

  // Income (higher income → better risk capacity)
  if (income === "<5L") score -= 3;
  else if (income === "5L-10L") score += 0;
  else if (income === "10L-20L") score += 3;
  else if (income === "20L-50L") score += 6;
  else if (income === ">50L") score += 8;

  // Behaviour in drawdown (very strong signal)
  if (marketDropResponse === "sell-all") score -= 20;
  else if (marketDropResponse === "sell-some") score -= 10;
  else if (marketDropResponse === "do-nothing") score += 5;
  else if (marketDropResponse === "buy-more") score += 15;

  // Self-declared risk tolerance
  if (riskTolerance === "Conservative") score -= 8;
  else if (riskTolerance === "Moderate") score += 0;
  else if (riskTolerance === "Aggressive") score += 10;

  // ----- 2) Map numeric score → final risk profile -----

  let riskProfile = "Moderate";

  if (score <= 45) {
    riskProfile = "Conservative";
  } else if (score >= 70) {
    riskProfile = "Aggressive";
  } else {
    riskProfile = "Moderate";
  }

  // ----- 3) Map profile → allocation -----

  let allocation;

  if (riskProfile === "Conservative") {
    allocation = {
      stocks: 25,
      bonds: 45,
      gold: 20,
      cash: 10,
    };
  } else if (riskProfile === "Aggressive") {
    allocation = {
      stocks: 80,
      bonds: 10,
      gold: 5,
      cash: 5,
    };
  } else {
    // Moderate
    allocation = {
      stocks: 55,
      bonds: 30,
      gold: 10,
      cash: 5,
    };
  }

  // ----- 4) Build a more tailored description -----

  const horizonText =
    investmentHorizon === "1-3 years"
      ? "a relatively short investment horizon"
      : investmentHorizon === "3-5 years"
      ? "a medium-term investment horizon"
      : investmentHorizon === "5-10 years" || investmentHorizon === "5-10 Years"
      ? "a long-term investment horizon"
      : investmentHorizon === "10+ years"
      ? "a very long-term investment horizon"
      : "your stated investment horizon";

  const emergencyText =
    emergencyFund === "yes"
      ? "You already have an emergency fund, which increases your capacity to take risk."
      : "You are still building your emergency fund, so your plan should leave some room for safety.";

  let profileSentence = "";

  if (riskProfile === "Conservative") {
    profileSentence =
      "You appear to be a conservative investor who prioritises capital preservation and lower volatility over aggressive growth.";
  } else if (riskProfile === "Aggressive") {
    profileSentence =
      "You appear to be an aggressive investor who is comfortable with meaningful short-term volatility in pursuit of higher long-term returns.";
  } else {
    profileSentence =
      "You appear to be a moderate investor who seeks a balance between growth and capital protection.";
  }

  const description = `${profileSentence} Your answers suggest ${horizonText}. ${emergencyText}`;

  return {
    riskProfile,
    description,
    allocation,
    meta: {
      score,
      factors: {
        age,
        income,
        emergencyFund,
        investmentHorizon,
        marketDropResponse,
        riskTolerance,
      },
    },
  };
}

module.exports = { calculateRiskProfile };
