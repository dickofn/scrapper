const axios = require("axios");
const otcsv = require("objects-to-csv");
const cheerio = require("cheerio");

// pemudapedulidhuafa
function pemudapedulidhuafa() {
  axios.get("https://pemudapedulidhuafa.org/daftarpanti/").then((res) => {
    const data = [];
    const rows = cheerio(".wpb_wrapper > table > tbody > tr ", res.data);

    for (let i = 1; i < rows.length; i++) {
      const item = {
        Yayasan: rows[i].children[1].children[1].children[0].data.trim(),
        Alamat: rows[i].children[3].children[1].children[0].data.trim(),
        Telp: rows[i].children[5].children[1].children[0].data.trim(),
      };
      data.push(item);
    }
    const transformed = new otcsv(data);
    transformed.toDisk("./result/pemudapedulidhuafa.csv");
  });
}

// infobdg
function infobdg() {
  axios
    .get("https://www.infobdg.com/v2/daftar-panti-asuhan-di-bandung/")
    .then((res) => {
      const data = [];
      const rows = cheerio(".td-post-content > ul > li", res.data);

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].children[0].data;
        const item = {
          Yayasan: row.split(":")[0].trim(),
          Alamat: row.split(":")[1].split("|")[0].trim(),
          Telp: row.split(":")[2]
            ? row.split(":")[2].trim()
            : row.split(":")[2],
        };
        data.push(item);
      }
      const transformed = new otcsv(data);
      transformed.toDisk("./result/infobdg.csv");
    });
}

function dinsosriau() {
  // dinsosriau
  axios
    .get(
      "https://dinsos.riau.go.id/web/index.php?option=com_content&view=article&id=580&Itemid=202"
    )
    .then((res) => {
      const data = [];
      const rows = cheerio("table > tbody > tr", res.data);

      for (let i = 1; i < rows.length; i++) {
        if (rows[i].children[3]) {
          let item;
          if (rows[i].children[3].children[0].name == "a") {
            item = {
              Yayasan: rows[i].children[3].children[0].children[0].data
                ? rows[i].children[3].children[0].children[0].data.trim()
                : rows[i].children[3].children[0].children[0].data,
              Alamat: rows[i].children[5].children[0].data
                ? rows[i].children[5].children[0].data.trim()
                : rows[i].children[5].children[0].data,
              Telp: rows[i].children[7].children[0].data
                ? rows[i].children[7].children[0].data.trim()
                : rows[i].children[7].children[0].data,
            };
          } else if (rows[i].children[3].children[0].name == "span") {
            item = {
              Yayasan: rows[i].children[3].children[0].children[0].children[0]
                .data
                ? rows[
                    i
                  ].children[3].children[0].children[0].children[0].data.trim()
                : rows[i].children[3].children[0].children[0].children[0].data,
              Alamat: rows[i].children[5].children[0].data
                ? rows[i].children[5].children[0].data.trim()
                : rows[i].children[5].children[0].data,
              Telp: rows[i].children[7].children[0].data
                ? rows[i].children[7].children[0].data.trim()
                : rows[i].children[7].children[0].data,
            };
          }
          data.push(item);
        }
      }

      const transformed = new otcsv(data.filter((item) => item != undefined));
      transformed.toDisk("./result/dinsosriau.csv");
    });
}

// bbpplembang
async function bbpplembang() {
  const pages = await axios
    .get(
      "http://bbpp-lembang.info/databaselm3/daftar.php?lm3PageSize=50&lm3Order=Sorter_id_unit_eseloni&lm3Dir=DESC&lm3Page=1"
    )
    .then((res) => {
      const footer = cheerio(".Footer > td > a", res.data);
      for (let i = 0; i < footer.length; i++) {
        if (footer[i].children[0].data == "Last")
          return footer[i].attribs.href
            .split("&")
            [footer[i].attribs.href.split("&").length - 1].split("=")[1];
      }
    });

  const dataTotal = [];
  for (let i = 1; i <= pages; i++) {
    await axios
      .get(
        "http://bbpp-lembang.info/databaselm3/daftar.php?lm3PageSize=50&lm3Order=Sorter_id_unit_eseloni&lm3Dir=DESC&lm3Page=" +
          i
      )
      .then((res) => {
        const data = [];
        const rows = cheerio("table > tbody > .Row ", res.data);

        for (let i = 1; i < rows.length; i++) {
          const yayasan = rows[i].children[3].children[0].data;
          const alamat = rows[i].children[15].children[0].data;
          const telp = rows[i].children[19].children[0].data;
          const item = {
            Yayasan: yayasan ? yayasan.trim() : yayasan,
            Alamat: alamat ? alamat.trim() : alamat,
            Telp: telp ? telp.trim() : telp,
          };
          data.push(item);
        }
        dataTotal.push(...data);
      });
    const transformed = new otcsv(dataTotal);
    transformed.toDisk("./result/bbpplembang.csv");
  }
}

// pemudapedulidhuafa();
// infobdg();
// dinsosriau();
bbpplembang();
