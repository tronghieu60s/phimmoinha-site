const puppeteer = require("puppeteer");
const { writeDataToCsv } = require("../../core/commonFuncs");

const file = "./hydrax.csv";
const login = "https://abyss.to/login";
const manager = "https://abyss.to/dashboard/manager";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(login);

  const url = await page.evaluate(() => document.location.href);
  if (url === login) {
    await page.focus("input[name=email]");
    await page.keyboard.type("phimmoisotrim2409@gmail.com");
    await page.focus("input[name=password]");
    await page.keyboard.type("phimmoinha.%RTYUujnb");
    await page.$eval("input[type=checkbox]", (check) => (check.checked = true));
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
  }

  let isStop = false;
  let current = 1;
  do {
    await page.goto(`${manager}?page=${current}`);

    const itemsData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".table tbody > tr"));
      const itemsData = items.map((item) => {
        const slug = item.getAttribute("class").replace("item-", "");
        const name = item.querySelector(".filename").innerText;
        return { name, slug };
      });
      return itemsData;
    });

    if (itemsData.length === 0) {
      isStop = true;
    }

    writeDataToCsv(itemsData, file);

    current += 1;
  } while (!isStop);

  await browser.close();
})();
