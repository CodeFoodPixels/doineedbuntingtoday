const fetch = require("node-fetch");
const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");

module.exports = async () => {
  const rawData = await fetch(
    "https://www.gov.uk/bank-holidays.json"
  ).then((res) => res.json());

  const today = utcToZonedTime(new Date(), "Europe/London");

  const todayString = `${today.getUTCFullYear()}-${`${
    today.getUTCMonth() + 1
  }`.padStart(2, 0)}-${`${today.getUTCDate()}`.padStart(2, 0)}`;

  const returnObj = {
    locations: [
      {
        name: "scotland",
        displayName: "Scotland",
        bunting: false,
        bankHoliday: false,
      },
      {
        name: "england-and-wales",
        displayName: "England",
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
    ],
    bunting: false,
    buntingLocations: [],
    bankHoliday: false,
    bankHolidayLocations: [],
    nextBankHoliday: new Date(Date.now() + 31449600000),
  };

  returnObj.locations = returnObj.locations.map((item) => {
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
  });

  const bankHolidays = returnObj.locations.filter(
    (location) => location.bankHoliday === true
  );

  if (bankHolidays.length > 0) {
    returnObj.bankHoliday = true;

    returnObj.bankHolidayLocations = bankHolidays.map(
      (location) => location.displayName
    );

    const bunting = bankHolidays.filter(
      (location) => location.bunting === true
    );

    if (bunting.length > 0) {
      returnObj.bunting = true;

      returnObj.buntingLocations = bankHolidays.map(
        (location) => location.displayName
      );
    }
  }

  returnObj.nextBankHoliday = returnObj.locations
    .map((item) => {
      return rawData[item.name].events.map((event) => event.date);
    })
    .flat()
    .reduce((nextBankHoliday, event) => {
      const eventDate = new Date(event);
      eventDate.setHours(0, 0, 0, 0);

      const zonedEventDate = zonedTimeToUtc(eventDate, "Europe/London");

      if (zonedEventDate > today && zonedEventDate < nextBankHoliday) {
        return zonedEventDate;
      }

      return nextBankHoliday;
    }, returnObj.nextBankHoliday);

  return returnObj;
};
