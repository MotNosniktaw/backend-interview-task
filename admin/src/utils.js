const { Parser } = require("json2csv");

module.exports = {
  /**
   * Creates a CSV string from a flattened list of user holdings
   * @param {Array<Object>} Holdings Flattened list of user holdings
   * @returns
   */
  createHoldingsReportCSV: (holdings) => {
    // TODO Implement nonblocking async stream based API for json-csv parsing
    const fields = [
      "User",
      "First Name",
      "Last Name",
      "Date",
      "Holding",
      "Value",
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    return parser.parse(holdings);
  },
};
