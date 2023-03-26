import Logger from "./logger";
import path from "path";

/**
 * @function 
 * Get or create a new logger
 * 获取或是创建一个新的日志记录器
 * @param log The path to log file, for creation only
 * @param errorLog The path to error log file, for creation only
 * @returns A logger instance
 */
export function getLogger(log?: string, errorLog?: string): Logger {
  if (!global.logger) {
    global.logger = new Logger(log, errorLog)

    // process.prependListener('SIGTERM', closeLogFiles)
    // process.prependListener('SIGINT', closeLogFiles)
    // process.prependListener('SIGKILL', closeLogFiles)
    process.prependListener('beforeExit', () => {
      if (global.logger && global.logger instanceof Logger) {
        const log = path.basename(global.logger.logFile)
        const errorLog = path.basename(global.logger.errorLogFile)
        const logFolder = path.dirname(global.logger.logFile)
        const errorLogFolder = path.dirname(global.logger.errorLogFile)
        global.logger.close(path.resolve(logFolder, '%Y-%m-%d_%H-%M-%S_' + log), path.resolve(errorLogFolder, '%Y-%m-%d_%H-%M-%S_' + errorLog))
      }
    })
  }
  return global.logger
}