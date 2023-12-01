import moment from "moment/moment.js";
import { addRecord } from "./sheet.js";

export const trackingSite = async (site) => {
  try {
    const res = await fetch(site);
    const data = [
      site,
      res.status,
      moment(new Date()).format("L"),
      moment(new Date()).hours(),
    ];
    addRecord(data);
  } catch (err) {
    const data = [
      site,
      400,
      moment(new Date()).format("L"),
      moment(new Date()).hours(),
    ];
    addRecord(data);
  }
};
