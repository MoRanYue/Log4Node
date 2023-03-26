# Log4Node

**Simple logger for Node.js.**

Its function is as stated in the title.

# How to use? 

Simple example: 
```js
const { getLogger } = require("./libs/log4node.js") // The path to this package.

// The path to log file and error log file. It's optional.
const logFile = "logs/log.log"
const logger = getLogger(logFile)

logger.info("A simple logger for Node.js.")

```

