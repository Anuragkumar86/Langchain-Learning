// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"

// const loader = new CheerioWebBaseLoader("https://www.amazon.in/Zebronics-UV-Printed-Multimedia-Retractable-Precision/dp/B0FN87F535/?_encoding=UTF8&pd_rd_w=Cdwfz&content-id=amzn1.sym.5f06effd-8e8f-4686-b8d9-883495d3c609&pf_rd_p=5f06effd-8e8f-4686-b8d9-883495d3c609&pf_rd_r=1S29RDNR7EZBS5GPJSTZ&pd_rd_wg=udZ67&pd_rd_r=a0339217-27df-4fca-8707-255b37e81779&ref_=pd_hp_d_btf_ls_gwc_pc_en2_&th=1")

// const docs = await loader.load();

// console.log(docs)





import {
  PlaywrightWebBaseLoader,
  Page,
  Browser,
} from "@langchain/community/document_loaders/web/playwright";

const url = "https://www.amazon.in/Zebronics-UV-Printed-Multimedia-Retractable-Precision/dp/B0FN87F535/?_encoding=UTF8&pd_rd_w=Cdwfz&content-id=amzn1.sym.5f06effd-8e8f-4686-b8d9-883495d3c609&pf_rd_p=5f06effd-8e8f-4686-b8d9-883495d3c609&pf_rd_r=1S29RDNR7EZBS5GPJSTZ&pd_rd_wg=udZ67&pd_rd_r=a0339217-27df-4fca-8707-255b37e81779&ref_=pd_hp_d_btf_ls_gwc_pc_en2_&th=1";

const loader = new PlaywrightWebBaseLoader(url, {
  async evaluate(page) {
    return await page.evaluate(() => {
      return document.body.innerText;
    });
  },
});

const docs = await loader.load();

console.log(docs[0].pageContent);