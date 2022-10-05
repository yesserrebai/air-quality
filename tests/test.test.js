import chai, { expect } from 'chai';
import request from 'supertest';
import app from '../src/index.js';
import { checkAirQuality } from '../src/cron/checkAirQualityCron.js';
import AirQuality from '../src/models/AirQuality.js';

describe('unit tests', () => {
  before(async function () {
    await AirQuality.deleteMany({});
  });
  it('air-quality API, should return 400 status and error message indicates expected longitude and latitude to be integer', async () => {
    await request(app)
      .get('/air-quality')
      .query({ longitude: 'aaaaa', latitude: 80 })
      .expect(400)
      .then((resp) => {
        expect(resp.body).to.have.property('Error');
        expect(resp.body.Error).to.be.equal(
          'expected longitude and latitude to be integer'
        );
      });
  });
  it('air-quality API, should return 400 status and error message indicates latitude to be within the range [-90,90]', async () => {
    await request(app)
      .get('/air-quality')
      .query({ longitude: 20, latitude: 91 })
      .expect(400)
      .then((resp) => {
        expect(resp.body).to.have.property('Error');
        expect(resp.body.Error).to.be.equal(
          'expected latitude to be within the range [-90,90]'
        );
      });
  });
  it('air-quality API, should return 200 status and a response', async () => {
    await request(app)
      .get('/air-quality')
      .query({ longitude: 20, latitude: 90 })
      .expect(200)
      .then((resp) => {
        expect(resp.body).to.have.property('Result');
      });
  });
  it('air quality API, should return 404 status and error message indicates no data found in database', async () => {
    await request(app)
      .get('/air-quality/most-polluted')
      .expect(404)
      .then((resp) => {
        expect(resp.body).to.have.property('Error');
        expect(resp.body.Error).to.be.equal('no data found in database');
      });
  });
  it('should check air quality for paris zone and saves it in db', async () => {
    await checkAirQuality();
  });
  it('air quality API, should return 200 status and time when paris zone was most polluted', async () => {
    await request(app)
      .get('/air-quality/most-polluted')
      .expect(200)
      .then((resp) => {
        expect(resp.body).to.have.property('data');
      });
  });
});
