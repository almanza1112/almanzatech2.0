function buildNotification(lead, id) {
  const { site, siteConfig, name, email, need, message } = lead;
  const needLabel = need ? siteConfig.needs[need] : "Not specified";
  const subject = `New inquiry from ${name}${need ? ` — ${needLabel}` : ""}`
    .replace(/[\r\n]+/g, " ")
    .slice(0, 150);

  return {
    from: { name: `${siteConfig.name} website`, address: siteConfig.from },
    to: siteConfig.notifyTo,
    replyTo: { name, address: email },
    subject,
    text: `Name: ${name}\nEmail: ${email}\nNeed: ${needLabel}\nSite: ${site}\n\n${message}\n\nLead ID: ${id}`,
  };
}

module.exports = { buildNotification };
