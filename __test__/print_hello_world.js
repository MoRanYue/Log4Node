const { getLogger } = require('../src/index')

const logger = getLogger()

logger.info('Hello world.')
logger.error('A disgusting error.')
logger.debugging('I hope the code never bugs!')
logger.warning('ATTENTION!')
logger.success('Though I do not know what happend.')
logger.failure('Umm.')