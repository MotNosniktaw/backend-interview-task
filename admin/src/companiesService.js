const request = require("request");
const config = require("config");

/**
 * Get data for all companies avilable for managed investments
 * @returns
 */
const getCompanies = async () => {
  return await new Promise((resolve) =>
    request.get(
      `${config.financialCompaniesServiceUrl}/companies`,
      (e, r, companies) => {
        if (e) {
          throw e;
        } else {
          resolve(JSON.parse(companies));
        }
      }
    )
  );
};

/**
 *
 * @param {Array<Object>} companies List of raw companies data
 * @param {string} id Unique Id of desired company
 * @returns {string} Name of desired company
 */
const getCompanyNameFromCompanyId = (companies, id) => {
  const company = companies.find((c) => c.id == id);
  if (company == null) throw "No company found with provided id.";
  return company?.name;
};

module.exports = {
  getCompanies,
  getCompanyNameFromCompanyId,
};
