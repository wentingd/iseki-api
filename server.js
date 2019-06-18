const app = require('./app');
const logger = require('./config/logger');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});
