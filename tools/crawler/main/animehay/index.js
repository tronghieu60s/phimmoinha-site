const puppeteer = require("puppeteer");
const { writeDataToCsv, generateSlug } = require("../../core/commonFuncs");

const folder = "./crawler/main/animehay";

const getSlug = (url) =>
  url
    .slice(0, url.lastIndexOf("-"))
    .replace("https://animehay.club/thong-tin-phim/", "");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.exposeFunction("getSlug", getSlug);

  browser.on("targetcreated", async (target) => {
    const page = await target.page();
    if (page) page.close();
  });

  let index = 1;
  do {
    const path = `https://animehay.club/thong-tin-phim/-${index}.html`;
    await page.goto(path);

    const url = await page.$eval("link[rel=canonical]", (el) => el.href);
    console.info(`${index} - ${url}`);

    const pageData = await page.evaluate(async (index) => {
      const url = document
        .querySelector("link[rel=canonical]")
        ?.getAttribute("href");
      const slug = await window.getSlug(url);
      const title = document.querySelector(".heading_movie")?.innerText?.trim();
      const content = document
        .querySelector(".desc.ah-frame-bg div:nth-child(2)")
        ?.innerText?.trim();
      const avatar = document
        .querySelector(".info-movie .first img")
        ?.getAttribute("src");
      const [quantity, quantityText] = document
        .querySelector(".duration div:nth-child(2)")
        ?.innerText?.split(" ");
      const publish = Number(
        document
          .querySelector(".update_time div:nth-child(2)")
          ?.innerText.trim()
      );

      const tags = document
        .querySelector(".name_other div:nth-child(2)")
        ?.innerText?.split(/[,|]+/)
        ?.map((item) => item.trim())
        ?.join(",");
      const categories = Array.from(document.querySelectorAll(".list_cate a"))
        ?.map((item) => item?.innerText?.trim())
        ?.join(",");
      const group = Array.from(
        document.querySelectorAll(".bind_movie .scroll-bar a")
      )?.map((item) => ({
        Name: item?.innerText?.trim(),
        Link: item?.getAttribute("href"),
      }));
      const episodes = Array.from(
        document.querySelectorAll(".list-item-episode.scroll-bar a")
      )
        ?.map((item) => item?.getAttribute("href"))
        ?.reverse();

      return {
        Id: index,
        Type: quantityText.trim().toLowerCase() === "tập" ? "Series" : "Movie",
        Title: title,
        Slug: slug,
        Content: content,
        Avatar: avatar,
        Publish: publish,
        Quantity: quantityText.trim().toLowerCase() === "tập" ? quantity : 1,
        Duration: quantityText.trim().toLowerCase() === "phút" ? quantity : 0,
        Tags: tags || "",
        Categories: categories || "",
        Url: url,
        Group: group,
        Episodes: episodes,
      };
    }, index);

    const { Group, Episodes, ...restData } = pageData;
    writeDataToCsv(restData, `${folder}/animehay_eps.csv`);

    const group = pageData.Group?.find(
      (item) => pageData.Slug === getSlug(item.Link)
    );
    const groupData = {
      Id: index,
      Slug: pageData.Slug,
      Episode: group?.Name,
      Groups: Group?.map((item) => `${item.Name}/${getSlug(item.Link)}`).join(
        ","
      ),
    };
    writeDataToCsv(groupData, `${folder}/animehay_groups.csv`);

    for (let i = 0; i < Episodes.length; i += 1) {
      page.goto(Episodes[i], { timeout: 0 });
      await page.waitForTimeout(500);

      try {
        await page.waitForSelector("#sv_Hydrax", { visible: true });
        await page.click("#sv_Hydrax");

        const Episode = await page.$eval(
          ".list-item-episode a[active]",
          (elm) => elm.getAttribute("title")
        );
        const Source = await page.$eval("#video-player iframe", (elm) =>
          elm.getAttribute("src")
        );

        const episodeData = {
          Movie_Ref: index,
          Title: Episode,
          Slug: generateSlug(Title),
          Order: i + 1,
          Source,
          Server: "Hydrax",
          Url: Episodes[i],
        };
        writeDataToCsv(episodeData, `${folder}/animehay_players.csv`);
      } catch (error) {}
    }
  } while (index++ < 3637);

  await browser.close();
})();
