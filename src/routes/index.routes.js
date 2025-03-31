/**
 * @file This file define the app routes for all end-points.
 */

import express from 'express';
import swaggerConfig from '../config/swagger.config';
import swagger from 'swagger-ui-express';
import hotelRoutes from './hotel.route';

const router = express.Router({ mergeParams: true });

router.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

router.use('/hotel', hotelRoutes)
export default router;
