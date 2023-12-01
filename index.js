import { createWorkBook } from "./sheet.js";
import { trackingSite } from "./utils.js";

const TRACKING_TIME = 5 * 60 * 1000; //5'

const main = () => {
  createWorkBook();

  setInterval(() => {
    trackingSite("https://dicamon.vn");
    trackingSite("https://book.dicamon.vn/sach-giao-khoa?grade=7");
    trackingSite("https://book.dicamon.vn/giai-de?grade=7");
  }, TRACKING_TIME);
};

main();
