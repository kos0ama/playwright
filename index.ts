import { chromium } from "playwright";
import { Parser } from "json2csv";
import * as fs from "fs";

const options = {
  headless: false,
};

const BASE_URL =
  "https://cloudapi.zendesk.com/hc/ja/categories/201092361";
const PER_PAGE = 10;

(async () => {
  const stores = [];
  const browser = await chromium.launch(options);
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

   await page.goto(BASE_URL);

  // 最大ページ数を取得
  const maxPage = await page.evaluate(() => {
    return Math.ceil(
      Number(document.querySelector(".smp-count").textContent) / 10
    );
  });

  // 最大ページ数の分だけループ
  for (let pageNumber = 1; pageNumber <= maxPage; pageNumber++) {
    const currentPageUrl = `${BASE_URL}=${pageNumber}`;
    await page.goto(currentPageUrl);

    // ５行目からが店舗データなので5始まりとする
    for (let rowNumber = 5; rowNumber < PER_PAGE + 5; rowNumber++) {
      // 詳細リンクを取得
      const detailLinkSelector = (rowNumber: number) => { return `#smp-table-27130 > tbody > tr.smp-row-${rowNumber}.smp-row-data .smp-cell-col-2 > a` }
      const detailLink = await page.$(detailLinkSelector(rowNumber));

      // 詳細リンクがなければスキップ
      if ( !detailLink ) { continue; }

      // 詳細ページに遷移してデータを保存
      await page.click(detailLinkSelector(rowNumber));
      await navigationPromise;

      const store = await page.evaluate(() => {
        const detailContentData = (rowNumber: number) => {
          return document.querySelector(`body > table > tbody > tr > td > div > div.whole > table > tbody > tr:nth-child(${rowNumber}) > td`)?.textContent?.trim() || ''
        }

        return {
          type: detailContentData(10),
          name: detailContentData(3),
          "phone number": detailContentData(8),
          address: detailContentData(6).replace(/\s+/g, "") + detailContentData(7),
          homepage: detailContentData(9),
          holiday: detailContentData(11),
          "business hours": detailContentData(12)
        };
      });

      await page.goto(currentPageUrl);
      await navigationPromise;

      stores.push(store)
    }
  }
  await browser.close();

  // CSVへのパース
  const parser = new Parser;
  const csv = parser.parse(stores);

  // ファイル書き込み
  fs.writeFileSync('goto-eat.csv', csv)
})();