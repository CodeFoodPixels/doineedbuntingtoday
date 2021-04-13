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
    },
    {
      name: "england-and-wales",
      displayName: "Wales",
      bunting: false,
    },
    {
      name: "scotland",
      displayName: "Scotland",
      bunting: false,
    },
    {
      name: "northern-ireland",
      displayName: "Northern Ireland",
      bunting: false,
    },
  ];

  const today = new Date();
  const todayString = `${today.getUTCFullYear()}-${`${
    today.getUTCMonth() + 1
  }`.padStart(2, 0)}-${`${today.getUTCDate()}`.padStart(2, 0)}`;

  const data = structure.map((item) => {
    const filteredEvents = rawData[item.name].events.filter(
      (event) => event.date === todayString
    );

    if (filteredEvents.some((event) => event.bunting === true)) {
      item.bunting = true;
    }
    return item;
  });

  return data
    .filter((location) => location.bunting === true)
    .reduce(
      (obj, location, i, src) => {
        if (i === 0) {
          obj.bankHoliday = true;
          obj.bunting = true;
          obj.locations = location.displayName;
          return obj;
        }

        if (i === src.length - 1) {
          obj.locations = `${obj.locations} or ${location.displayName}`;
          return obj;
        }

        obj.locations = `${obj.locations}, ${location.displayName}`;
        return obj;
      },
      { bunting: false, locations: "", bankHoliday: false }
    );
};
