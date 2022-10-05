import AirQuality from '../models/AirQuality.js';
const airQualityBaseUrl = `https://api.airvisual.com/v2/nearest_city?key=`;
import { CronJob } from 'cron';
import axios from 'axios';
/**
 * @description check air quality  for a specific zone and saves it in db
 */
export async function checkAirQuality() {
  try {
    console.log('job is runnning every minute');
    let result;
    const lat = '48.856613';
    const lon = '2.352222';
    const data = await axios.get(
      `${airQualityBaseUrl}${process.env.AIR_QUALITY_KEY}&lat=${lat}&lon=${lon}`
    );
    if (data.data.status == 'success') {
      let pollution = data.data.data.current.pollution;
      const doc = new AirQuality({
        ts: pollution.ts,
        aqicn: pollution.aqicn,
        aqius: pollution.aqius,
        maincn: pollution.maincn,
        mainus: pollution.mainus,
      });
      doc.isNew = true;
      result = await doc.save();
    }
    return result;
  } catch (error) {
    return error.message;
  }
}
/**
 * @description set a cron job that runs every minutes on checkAirQuality function
 */
var job = new CronJob('1 * * * * *', async function () {
  checkAirQuality();
});
export { job };
