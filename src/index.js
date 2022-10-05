import dotenv from 'dotenv';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import airQualityRouter, {
  routes as airQualityRoutes,
} from './API/routes/airQuality/airQualityRouter.js';
import { job } from './cron/checkAirQualityCron.js';
dotenv.config();

const app = express();
if (process.env.NODE_ENV === 'mocha') {
  mongoose
    .connect('mongodb://localhost:27017/IQAIR-test')
    .then((conn) => {
      console.log('test database connected');
    })
    .catch((e) => {
      console.log(e);
    });
} else {
  mongoose
    .connect('mongodb://localhost:27017/IQAIR')
    .then((conn) => {
      console.log('database connected');
    })
    .catch((e) => {
      console.log(e);
    });
}

app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(airQualityRoutes.root, airQualityRouter);

// Swagger initialization
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'air-quality',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/API/routes/*/*Router.js'],
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.all('*', (req, res) => {
  return res
    .status(404)
    .json({ Error: `couldn't find this ${req.originalUrl} on the server` });
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT} `);
});

job.start();
export default app;
