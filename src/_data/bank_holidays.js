const fetch = require("node-fetch");

module.exports = async () => {
  const rawData = await fetch(
    "https://www.gov.uk/bank-holidays.json"
  ).then((res) => res.json());

  const structure = [
    {
      name: "england-and-wales",
      displayName: "England",
      bunting: false,
      bankHoliday: false,
    },
    {
      name: "scotland",
      displayName: "Scotland",
      bunting: false,
      bankHoliday: false,
    },
    {
      name: "england-and-wales",
      displayName: "Wales",
      bunting: false,
      bankHoliday: false,
    },
    {
      name: "northern-ireland",
      displayName: "Northern Ireland",
      bunting: false,
      bankHoliday: false,
    },
  ];

  const today = new Date();
  const todayString = `${today.getUTCFullYear()}-${`${
    today.getUTCMonth() + 1
  }`.padStart(2, 0)}-${`${today.getUTCDate()}`.padStart(2, 0)}`;

  const returnObj = {
    bunting: false,
    buntingLocations: [],
    bankHoliday: false,
    bankHolidayLocations: [],
  };

  structure
    .map((item) => {
      const filteredEvents = rawData[item.name].events.filter(
        (event) => event.date === todayString
      );

      if (filteredEvents.length > 0) {
        item.bankHoliday = true;
      }

      if (filteredEvents.some((event) => event.bunting === true)) {
        item.bunting = true;
      }
      return item;
    })
    .filter((location) => {
      return location.bankHoliday === true;
    })
    .forEach((location, i, src) => {
      if (location.bunting === true) {
        returnObj.bunting = true;
        returnObj.buntingLocations.push(location.displayName);
      }

      returnObj.bankHoliday = true;
      returnObj.bankHolidayLocations.push(location.displayName);
    });

  returnObj.buntingLocations =
    returnObj.buntingLocations.length > 1
      ? `${returnObj.buntingLocations
          .slice(0, -1)
          .join(", ")} or ${returnObj.buntingLocations.slice(-1)}`
      : returnObj.buntingLocations[0];
  returnObj.bankHolidayLocations =
    returnObj.bankHolidayLocations.length > 1
      ? `${returnObj.bankHolidayLocations
          .slice(0, -1)
          .join(", ")} and ${returnObj.bankHolidayLocations.slice(-1)}`
      : returnObj.bankHolidayLocations[0];
  return returnObj;
};
