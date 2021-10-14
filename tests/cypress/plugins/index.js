/// <reference types="cypress" />
const puppeteer = require("puppeteer");

async function clearBrowserCookies(page) {
  const client = await page.target().createCDPSession();
  await await client.send("Network.clearBrowserCookies");
}

module.exports = async (on, config) => {
  let cookies;

  on("task", {
    log(message) {
      console.log(message);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
    login({ username, password }) {
      if (cookies) {
        return { cookies };
      } else {
        return (async () => {
          const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: true,
          });
          const page = await browser.newPage();
          clearBrowserCookies(page);

          await page.goto(config.baseUrl + "/login?test_backend=true", {
            // The app redirects to the login-page
            waitUntil: "networkidle2", // Wait until login-page has been reached
          });
          await page.click("#cookie-policy-button-accept");
          await page.type("#id_email", username); // Insert username in form
          await page.type("#id_password", password); // Insert password
          await page.click('button[type="submit"]'); // Click login button
          await page.waitForNavigation({ waitUntil: "networkidle2" });
          await page.click('button[type="submit"]'); // Click "Yes, log me in"

          await page.waitForNavigation({ waitUntil: "networkidle2" });
          cookies = await page.cookies();
          await browser.close();
          return { cookies };
        })();
      }
    },
  });
};
