const dateAdd = require("date-fns/add");
const { zonedTimeToUtc } = require("date-fns-tz");

const template = `const { request } = require("https");
const { schedule } = require("@netlify/functions");

exports.handler = schedule("0 0 0 0 0", async () => {
  await new Promise((resolve, reject) => {
    const req = request(
      "https://api.netlify.com/build_hooks/<<build_hook>>",
      { method: "POST" },
      (res) => {
        console.log("statusCode:", res.statusCode);
        resolve();
      }
    );

    req.on("error", (e) => {
      console.error(e);
      reject();
    });
    req.end();
  });

  return {
    statusCode: 200,
  };
});
`;

class NextBuild {
  data() {
    return {
      permalink: "netlify/functions/scheduledRebuild-generated.js",
      permalinkBypassOutputDir: true,
    };
  }

  dateToCron(date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  }

  getUTCEventDate(date, timezone) {
    const padded = (val) => val.toString().padStart(2, "0");

    return zonedTimeToUtc(
      `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(
        date.getDate()
      )} ${padded(date.getHours())}:${padded(date.getMinutes())}:${padded(
        date.getSeconds()
      )}`,
      timezone
    );
  }

  async render({ bank_holidays }) {
    const tomorrow = dateAdd(new Date().setHours(0, 0, 0, 0), { days: 1 });
    const nextRebuild = bank_holidays.bankHoliday
      ? tomorrow
      : bank_holidays.nextBankHoliday;

    return template
      .replace(
        "0 0 0 0 0",
        this.dateToCron(this.getUTCEventDate(nextRebuild, "Europe/London"))
      )
      .replace("<<build_hook>>", process.env.BUILD_HOOK);
  }
}

module.exports = NextBuild;
