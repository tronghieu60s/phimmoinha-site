const { writeDataToCsv } = require("../commonFuncs");

async function mainCrawler(page, index) {
  const data = await page.evaluate(
    async ({ index }) => {
      function convertToSlug(str) {
        const rmTones = str
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .replace(/[^\w\s]/gi, "");
        return rmTones.replace(/\s+/g, "-");
      }

      /* Select Value */
      const filmInfo = document.querySelector(".film-info");
      const filmInfoImage = filmInfo.querySelector(".image");
      const filmInfoAvatar = filmInfoImage.querySelector(".avatar");
      const filmType = filmInfo.querySelector(".latest-episode");
      const filmInfoText = filmInfo.querySelector(".text");
      const filmInfoTitle = filmInfoText.querySelector("h1");
      const filmInfoOriginal = filmInfoText.querySelector("h2");
      const filmInfoMeta = filmInfo.querySelector(".text .entry-meta");

      const filmInfoMetaItem = {};
      for (const metaItem of filmInfoMeta.children) {
        const metaItemText = metaItem.querySelector("label")?.innerText;
        if (metaItemText?.includes("Đang phát:")) {
          filmInfoMetaItem.quantity = metaItem.querySelector("span");
        }
        if (metaItemText?.includes("Năm Phát Hành:")) {
          filmInfoMetaItem.publish = metaItem.querySelector("a");
        }
        if (metaItemText?.includes("Quốc gia:")) {
          filmInfoMetaItem.countries = Array.from(
            metaItem.querySelectorAll("a")
          );
        }
        if (metaItemText?.includes("Thể loại:")) {
          filmInfoMetaItem.movie_categories = Array.from(
            metaItem.querySelectorAll("a")
          );
        }
        if (metaItemText?.includes("Đạo diễn:")) {
          filmInfoMetaItem.directors = Array.from(
            metaItem.querySelectorAll("a")
          );
        }
        if (metaItemText?.includes("Diễn viên:")) {
          filmInfoMetaItem.actors = Array.from(metaItem.querySelectorAll("a"));
        }
        if (metaItemText?.includes("Thời lượng:")) {
          filmInfoMetaItem.duration = metaItem;
        }
      }

      const filmContent = filmInfo.querySelector("#film-content");
      const filmTag = Array.from(
        filmInfo.querySelectorAll("#tags .tags-list li")
      );
      const filmTrailer = document.querySelector(
        "#trailer > script:nth-child(5)"
      );
      const filmTrailerText = filmTrailer.innerText.slice(
        filmTrailer.innerText.indexOf("https://www.youtube.com/watch?v=")
      );

      /* Get Value */

      const movie_avatar = filmInfoAvatar.getAttribute("src");
      const movie_type = filmType ? "series" : "movie";
      const movie_title = filmInfoTitle.innerText;
      const movie_original = filmInfoOriginal.innerText
        .slice(0, filmInfoOriginal.innerText.lastIndexOf("("))
        .trim();
      const movie_quality = filmInfoMetaItem.quantity.innerText;
      const movie_publish = Number(filmInfoMetaItem.publish.innerText);

      const movie_actor = filmInfoMetaItem.actors
        .map((o) => o.innerText)
        .join(", ");
      const movie_director = filmInfoMetaItem.directors
        .map((o) => o.innerText)
        .join(", ");
      const movie_country = filmInfoMetaItem.countries
        .map((o) => o.innerText)
        .join(", ");
      const movie_category = filmInfoMetaItem.movie_categories
        .map((o) => o.innerText)
        .join(", ");
      const movie_tag = filmTag.map((tag) => tag.innerText).join(", ");

      const movie_duration = Number(
        filmInfoMetaItem.duration.innerText
          .split(":")[1]
          .split("phút")[0]
          .trim()
      );
      const movie_episode = Number(
        filmInfoMetaItem.duration.innerText.split(":")[1].split("Tập")[0].trim()
      );
      const movie_content = filmContent.innerText
        .split("Thuyết Minh")[1]
        .trim();
      const movie_status = "draft";
      const movie_comment = "open";
      const movie_episodes = [];
      const movie_slug = convertToSlug(filmInfoTitle.innerText);
      const movie_excerpt = filmContent.innerText
        .split("Thuyết Minh")[0]
        .trim();
      const movie_trailer = filmTrailerText.slice(
        0,
        filmTrailerText.indexOf('"')
      );
      const movie_date = new Date().toISOString();
      const movie_modified = new Date().toISOString();

      /* Response Value */

      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 50000);
      // });

      return {
        _id: index,
        movie_avatar,
        movie_type,
        movie_title,
        movie_original,
        movie_quality,
        movie_publish,
        movie_category,
        movie_tag,
        movie_actor,
        movie_director,
        movie_duration,
        movie_country,
        movie_content,
        movie_status,
        movie_comment,
        movie_episode,
        movie_episodes,
        movie_slug,
        movie_excerpt,
        movie_trailer,
        movie_date,
        movie_modified,
      };
    },
    { index }
  );

  page.close();

  writeDataToCsv(data);
}

module.exports = mainCrawler;
