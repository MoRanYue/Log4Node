const { getLogger } = require('../dist/logger4node')

const logger = getLogger('logs/test.log', 'logs/error.log')

logger.info('These messages will be in logs/test.log')
logger.info('Hello world.')
logger.info('Error messages will in both logs/test.log and logs/error.log')
logger.error('A disgusting error.')
logger.debugging('I hope the code never bugs!')
logger.warning('ATTENTION!')
logger.success('Though I do not know what happend.')
logger.failure('Umm.')

