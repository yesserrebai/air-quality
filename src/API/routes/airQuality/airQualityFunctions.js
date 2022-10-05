import axios from 'axios';
import AppError from '../../utils/appError.js';
import AirQuality from '../../../models/AirQuality.js';
const airQualityBaseUrl = `https://api.airvisual.com/v2/nearest_city?key=`;
/**
 *
 * @param {String} longitude the longitude of the zone
 * @param {String} latitude the latitude of the zone
 * @returns the air quality in a given zone
 */
export async function getAirQuality(req, res) {
  try {
    if (!req.query.longitude || !req.query.latitude) {
      throw new AppError(
        'expected longitude and latitude as query paramter',
        400
      );
    }
    const lon = req.query.longitude;
    const lat = req.query.latitude;
    const lonNumber = Number(lon);
    const latNumber = Number(lat);

    if (!latNumber || !lonNumber) {
      throw new AppError('expected longitude and latitude to be integer', 400);
    }
    if (latNumber > 90 || latNumber < -90) {
      throw new AppError(
        'expected latitude to be within the range [-90,90]',
        400
      );
    }
    if (lonNumber > 180 || lonNumber < -180) {
      throw new AppError(
        'expected longitude to be within the range [-180,180]',
        400
      );
    }

    const data = await axios.get(
      `${airQualityBaseUrl}${process.env.AIR_QUALITY_KEY}&lat=${lat}&lon=${lon}`
    );
    return res
      .status(200)
      .json({ Result: { pollution: data.data.data.current.pollution } });
  } catch (error) {
    return res.status(error.status).json({ Error: error.message });
  }
}
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @returns the date and time where paris zone was at it's maximum pollution
 */
export async function mostPolluted(req, res) {
  try {
    const data = await AirQuality.findOne()
      .sort({ aqius: -1 })
      .limit(1)
      .select({ ts: 1, _id: 0 });
    if (data == null) {
      return res.status(404).json({ Error: 'no data found in database' });
    }
    return res.status(200).json({ data: { date: data.ts } });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}
