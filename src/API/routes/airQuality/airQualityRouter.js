import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getAirQuality, mostPolluted } from './airQualityFunctions.js';

export const routes = {
  root: '/air-quality',
  getAirQuality: '',
  mostPolluted: '/most-polluted',
};

const airQualityRouter = express.Router();

/**
 * @openapi
 * /air-quality:
 *   get:
 *     summary: get air quality of given zone
 *     parameters: [
 *      {
 *        name: longitude,
 *        in: query parameter,
 *        description : 'must be within range (-180, 180)'
 *      },
 *      {
 *        name: latitude,
 *        in: query parameter,
 *        description : 'must be within range (-90, 90)'
 *      }
 *     ]
 *     tags:
 *     - air-quality
 */
airQualityRouter.get(routes.getAirQuality, getAirQuality);
/**
 * @openapi
 * /air-quality/most-polluted:
 *   get:
 *     summary: get the date and time where paris zone was at it's maximum pollution
 *     tags:
 *     - air-quality
 */
airQualityRouter.get(routes.mostPolluted, mostPolluted);

export default airQualityRouter;
