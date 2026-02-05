import * as Sentry from '@sentry/node'
import express from "express";
import 'dotenv/config';

import bookingRouter from '../routes/Booking.js'
import hostRouter from '../routes/Host.js'
import propertyRouter from '../routes/Property.js'
import reviewRouter from '../routes/Review.js'
import userRouter from '../routes/User.js'
import amenitiesRouter from '../routes/Amenities.js'
import loginRouter from '../routes/Login.js'

import log from "../middleware/logMiddleware.js";
import errorHandler from "../middleware/errorHandler.js"


const app = express();

Sentry.init({
  dsn: 'https://5b763d272a1fdc9ad90db551d57bec8b@o4508780079808512.ingest.de.sentry.io/4508780098420816',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(log);

app.use("/bookings", bookingRouter);
app.use("/hosts", hostRouter);
app.use("/properties", propertyRouter);
app.use("/reviews", reviewRouter);
app.use("/amenities", amenitiesRouter);
app.use("/users", userRouter);

app.use("/login", loginRouter);

// Trace errors
// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
