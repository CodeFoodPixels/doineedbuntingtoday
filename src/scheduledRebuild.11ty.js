const dateAdd = require("date-fns/add");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

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

  async render({ bank_holidays }) {
    const tomorrow = zonedTimeToUtc(
      dateAdd(
        utcToZonedTime(new Date(), "Europe/London").setHours(0, 0, 0, 0),
        { days: 1 }
      ),
      "Europe/London"
    );
    const nextRebuild = bank_holidays.bankHoliday
      ? tomorrow
      : bank_holidays.nextBankHoliday;

    return template
      .replace("0 0 0 0 0", this.dateToCron(nextRebuild))
      .replace("<<build_hook>>", process.env.BUILD_HOOK);
  }
}

module.exports = NextBuild;
