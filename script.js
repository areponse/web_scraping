const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

const fs = require("fs").promises;

// Enable headless mode
const options = new firefox.Options();
options.addArguments("--headless");

const websites = [
  {
    url: "https://www.made-in-china.com/productdirectory.do?word=smartphone&subaction=hunt&style=b&mode=and&code=0&comProvince=nolimit&order=0&isOpenCorrection=1",
    title: "Made In China",
    containerSelector: ".prod-content",
    titleSelector: ".product-name a",
    priceSelector: ".price",
  },
  {
    url: "https://shop.smartone.com/en/storefront/",
    containerSelector: ".st-prod-tile",
    titleSelector: ".st-prod-title",
    priceSelector: ".st-price",
    title: "SmarTone",
  },
  {
    url: "https://rw.kikuu.com/search/result?belongCategory=999578&kw=Phones",
    title: "KIKU",
    containerSelector: ".searchGoods-item___3gN71",
    titleSelector: ".searchGoods-name___2Sm89",
    priceSelector: ".searchGoods-price___2nc3K",
  },
];

const scrapes = async () => {
  const browser = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();
  let result = [];
  try {
    for (x = 0; x < websites.length; x++) {
      await browser.get(websites[x].url);
      const products = await browser.wait(
        until.elementsLocated(By.css(websites[x].containerSelector)),
        10000
      );

      for (const product of products) {
        try {
          const titleElement = await product.findElement(
            By.css(websites[x].titleSelector)
          );
          const priceElement = await product.findElement(
            By.css(websites[x].priceSelector)
          );

          const title = await titleElement.getText();
          const price = await priceElement.getText();

          result.push({
            website: websites[x].title,
            title,
            price,
            timestamp: new Date().toLocaleString(),
          });
        } catch (innerError) {
          console.error(`Error processing product: ${innerError.message}`);
        }
      }
    }
    await browser.quit();
    await fs.writeFile("scraped-data.json", JSON.stringify(result, null, 2));
    console.log("Scraped data saved to 'scraped-data.json'");

    console.log(result);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("done");
  }
};

scrapes();
