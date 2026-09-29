// Adding a site means adding an entry here and registering its web app for App Check.
const SITES = {
  almanzatech: {
    name: "AlmanzaTech",
    origins: ["https://almanzatech.com", "https://www.almanzatech.com"],
    notifyTo: "bryant@almanzatech.com",
    from: "bryant@almanzatech.com",
    needs: {
      website: "Website",
      app: "App",
      "it-support": "IT support",
      "not-sure": "Not sure",
    },
  },
};

module.exports = { SITES };
