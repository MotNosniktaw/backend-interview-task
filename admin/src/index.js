const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const {
  getCompanies,
  getCompanyNameFromCompanyId,
} = require("./companiesService");
const { createHoldingsReportCSV } = require("./utils");
const { getInvestments, sendHoldingsReport } = require("./investmentsService");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.post("/users/holdings/report", async (req, res) => {
  try {
    const investments = await getInvestments();
    const companies = await getCompanies();

    const holdings = investments.reduce((output, investment) => {
      investment.holdings.forEach((h) => {
        output.push({
          User: investment.userId,
          "First Name": investment.firstName,
          "Last Name": investment.lastName,
          Date: investment.date,
          Holding: getCompanyNameFromCompanyId(companies, h.id),
          Value: investment.investmentTotal * h.investmentPercentage,
        });
      });
      return output;
    }, []);

    const csv = createHoldingsReportCSV(holdings);
    await sendHoldingsReport(csv);

    res.send("User holdings report successfully sent.");
  } catch (err) {
    console.error(err);
    res.send(500);
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
