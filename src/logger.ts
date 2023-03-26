import fs from 'node:fs'
import path from 'node:path'
import utils from 'node:util'
import console from './console'
import { Color } from './enums/Console'
import { LogLevel } from './enums/LogLevel'
import formatDate from './formatDate'

class Logger {
  private log: string
  private errorLog: string
  protected stream: fs.WriteStream | undefined
  protected errorStream: fs.WriteStream | undefined

  /**
   * @function 日志记录器
   * @param log 日志文件路径
   */
  constructor(log?: string, errorLog?: string) {
    this.log = ''
    this.errorLog = ''
    if (log) {
      this.log = path.resolve(log)
      this.errorLog = path.resolve(errorLog ?? `${path.dirname(this.log)}/error_${path.basename(this.log)}`)
      
      this.createLog()
    }
  }

  /**
   * @function 创建日志文件
   */
  private createLog() {
    const options: Record<string, any> = {
      encoding: 'utf-8',
      autoClose: true,
      flags: 'w'
    }

    if (this.log) {
      fs.mkdirSync(path.dirname(this.log), {recursive: true})

      let canRecordLog: boolean = false
      try {
        fs.accessSync(this.log, fs.constants.W_OK)
        canRecordLog = true
      } catch (err) {
        if (String(err).includes('no such file or directory')) {
          canRecordLog = true
        }
      }

      if (canRecordLog) {
        this.stream = fs.createWriteStream(path.resolve(this.log), options)
        this.success('Log file is created in %s', this.log)
      } else {
        this.error('Could not create log file')
      }
    }
    if (this.errorLog) {
      fs.mkdirSync(path.dirname(this.errorLog), {recursive: true})

      let canRecordLog: boolean = false
      try {
        fs.accessSync(this.errorLog, fs.constants.W_OK)
        canRecordLog = true
      } catch (err) {
        if (String(err).includes('no such file or directory')) {
          canRecordLog = true
        }
      }

      if (canRecordLog) {
        this.errorStream = fs.createWriteStream(path.resolve(this.errorLog), options)
        this.success('Error log file is created in %s', this.errorLog)
      } else {
        this.error('Could not create error log file')
      }
    }


  }

  /**
   * @function 将字符串打印到标准输出并换行
   * @param content 打印的内容
   * @param isError 是否应该打印到标准错误
   */
  private basePrint(content: string, isError?: boolean): void {
    if (isError) {
      process.stderr.write(content + '\n')
      return 
    }
    process.stdout.write(content + '\n')
  }
  
  public get logFile(): string {
    return this.log
  }
  public set logFile(v: string) {
    this.log = v;
    this.close()
    this.createLog()
  }
  public get errorLogFile(): string {
    return this.errorLog
  }
  public set errorLogFile(v: string) {
    this.log = v;
    this.close()
    this.createLog()
  }

  /**
   * @function 检查日志文件写入流是否可用
   * @returns 日志文件是否有效
   */
  private logIsWritable(): boolean {
    return Boolean(this.stream?.writable) && Boolean(this.errorStream?.writable)
  }
  /**
   * @function 将字符串写入日志文件
   * @param content 打印的内容
   * @param isError 是否为错误消息
   */
  private writeLog(content: string, isError?: boolean): void {
    if (this.logIsWritable()) {
      content = content.replaceAll(/\x1B\[.{0,2}[mJ]/g, '')

      this.stream?.write(content)
      this.stream?.write('\n')
      if (isError) {
        this.errorStream?.write(content)
        this.errorStream?.write('\n')
      }
    }
  }
  /**
   * @function 
   * Close log files
   * 关闭日志文件
   */
  close(newLogFilename?: string, newErrorLogFilename?: string): void {
    if (this.logIsWritable()) {
      this.stream?.close()
      this.errorStream?.close()
      if (newLogFilename) {
        fs.rename(this.log, formatDate(newLogFilename), () => {})
      }
      if (newErrorLogFilename) {
        fs.rename(this.errorLog, formatDate(newErrorLogFilename), () => {})
      }
    }
  }

  static buildLogRecord(content: string, level: LogLevel = LogLevel.info, ...formatting: any[]): string {
    const recordingTime = `[${formatDate('%Y-%m-%d %H:%M:%S.%l')}]`

    switch (level) {
      case LogLevel.error:
        return console.color(Color.fBlack, Color.bBlue, `${recordingTime}[ERROR] ${utils.format(content, ...formatting)}`)

      case LogLevel.failure:
        return console.color(Color.fRed, Color.bBlue, `${recordingTime}[FAILURE] ${utils.format(content, ...formatting)}`)

      case LogLevel.success:
        return console.color(Color.fGreen, `${recordingTime}[SUCCESS] ${utils.format(content, ...formatting)}`)

      case LogLevel.warning:
        return console.color(Color.fYellow, `${recordingTime}[WARNING] ${utils.format(content, ...formatting)}`)

      case LogLevel.debugging:
        return console.color(Color.fBlue, `${recordingTime}[DEBUGGING] ${utils.format(content, ...formatting)}`)

      default:
        return `${recordingTime}[INFO] ${utils.format(content, ...formatting)}`
    }
  }

  /**
   * @function
   * Print text to console and write log file
   * 将内容打印到控制台并写入日志
   * @param content The text will be printed 将要打印的内容
   * @param level Log level 日志等级
   * @param formatting Formatting string 格式化字符串
   */
  print(content: string, level: LogLevel = LogLevel.info, ...formatting: any[]): void {
    const record = Logger.buildLogRecord(content, level, ...formatting)

    if (level == LogLevel.error) {
      this.basePrint(record, true)
      this.writeLog(record, true)
      return
    }
    this.basePrint(record)
    this.writeLog(record)
  }

  info(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.info, ...formatting)
  }
  error(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.error, ...formatting)
  }
  /**
   * @function 
   * Output the error log using a fixed string
   * 用固定的字符串来输出错误日志
   * @param error A error instance 一个错误对象
   */
  errorHappens(error: Error) {
    return this.print(`Error caught: %s\nCause: %s\nTraceback: %s\n%s`, LogLevel.error, error.message, error.cause, error.message, error.stack)
  }
  warning(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.warning, ...formatting)
  }
  failure(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.failure, ...formatting)
  }
  success(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.success, ...formatting)
  }
  debugging(content: string, ...formatting: any[]) {
    return this.print(content, LogLevel.debugging, ...formatting)
  }
}

export default Logger