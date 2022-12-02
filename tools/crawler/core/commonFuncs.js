const ObjectsToCsv = require("objects-to-csv");

const generateSlug = (str) => {
  const rmTones = str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^\w\s]/gi, "");
  return rmTones.replace(/\s+/g, "-");
};

function writeDataToCsv(data, filePath = "./data.csv") {
  let csv = new ObjectsToCsv([]);
  if (Array.isArray(data)) {
    csv = new ObjectsToCsv([...data]);
  } else if (typeof data === "object") {
    csv = new ObjectsToCsv([data]);
  }
  return csv.toDisk(filePath, { append: true });
}

module.exports = { generateSlug, writeDataToCsv };
