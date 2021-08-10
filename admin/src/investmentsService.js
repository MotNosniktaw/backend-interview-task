const request = require("request");
const config = require("config");

/**
 * Returns all managed investments.
 * @returns Promise<Object>
 */
const getInvestments = async () => {
  return await new Promise((resolve) =>
    request.get(
      `${config.investmentsServiceUrl}/investments`,
      (e, r, investments) => {
        if (e) {
          throw e;
        } else {
          resolve(JSON.parse(investments));
        }
      }
    )
  );
};

/**
 * Submits a report of Users' Holding in CSV format
 * @param {string} report CSV string detailing all holdings for all users
 * @returns
 */
const sendHoldingsReport = async (report) => {
  console.log({ report });
  return await new Promise((resolve, reject) => {
    request.post(
      `${config.investmentsServiceUrl}/investments/export`,
      {
        body: JSON.stringify({ report }),
        headers: {
          "content-type": "application/json",
        },
      },
      (e, r, response) => {
        console.log({ e, r, response });
        if (e) {
          throw e;
        } else {
          resolve(response);
        }
      }
    );
  });
};

module.exports = {
  getInvestments,
  sendHoldingsReport,
};
