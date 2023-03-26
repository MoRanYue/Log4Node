'use strict';

var fs = require('node:fs');
var path = require('node:path');
var utils = require('node:util');
var path$1 = require('path');

var Console;
(function (Console) {
    Console["cleanUp"] = "2";
    Console["removeStyles"] = "0";
    Console["highlight"] = "1";
    Console["grey"] = "2";
    Console["italic"] = "3";
    Console["underline"] = "4";
    Console["twinkle"] = "5";
    Console["reverse"] = "7";
    Console["hidden"] = "8";
})(Console || (Console = {}));
var Color;
(function (Color) {
    Color["bBlack"] = "40";
    Color["bDarkRed"] = "41";
    Color["bGreen"] = "42";
    Color["bYellow"] = "43";
    Color["bBlue"] = "44";
    Color["bPurple"] = "45";
    Color["bDarkGreen"] = "46";
    Color["bWhite"] = "47";
    Color["fBlack"] = "30";
    Color["fRed"] = "31";
    Color["fGreen"] = "32";
    Color["fYellow"] = "33";
    Color["fBlue"] = "34";
    Color["fPurple"] = "35";
    Color["fDarkGreen"] = "36";
    Color["fWhite"] = "37";
})(Color || (Color = {}));

function removeStyles() {
    return `\x1B[${Console.removeStyles}m`;
}
function underline(content) {
    return `\x1B[${Console.underline}m${content}${removeStyles()}`;
}
function italic(content) {
    return `\x1B[${Console.italic}m${content}${removeStyles()}`;
}
function highlight(content) {
    return `\x1B[${Console.highlight}m${content}${removeStyles()}`;
}
function hidden(content) {
    return `\x1B[${Console.hidden}m${content}${removeStyles()}`;
}
function grey(content) {
    return `\x1B[${Console.grey}m${content}${removeStyles()}`;
}
function reverse(content) {
    return `\x1B[${Console.reverse}m${content}${removeStyles()}`;
}
function twinkle(content) {
    return `\x1B[${Console.twinkle}m${content}${removeStyles()}`;
}
function color(...content) {
    let text = '';
    for (let i = 0; i < content.length; i++) {
        const e = content[i];
        if (Object.values(Color).includes(e)) {
            text += `\x1B[${e}m`;
        }
        else if (e == 'REMOVESTYLES') {
            text += removeStyles();
        }
        else {
            text += e;
        }
        if (i == content.length - 1) {
            text += removeStyles();
        }
    }
    return text;
}
var console = {
    removeStyles,
    color,
    italic,
    hidden,
    highlight,
    grey,
    reverse,
    twinkle,
    underline
};

var LogLevel;
(function (LogLevel) {
    LogLevel["info"] = "info";
    LogLevel["error"] = "error";
    LogLevel["warning"] = "warning";
    LogLevel["failure"] = "failure";
    LogLevel["success"] = "success";
    LogLevel["debugging"] = "debugging";
})(LogLevel || (LogLevel = {}));

function formatDate(formatValue, date = new Date()) {
    let result = '';
    let char = '';
    let pos = -1;
    function advance() {
        pos += 1;
        char = formatValue[pos];
    }
    advance();
    const _l = date.getMilliseconds();
    const _s = date.getSeconds();
    const _M = date.getMinutes();
    const _h = date.getHours();
    const _d = date.getDate();
    const _m = date.getMonth() + 1;
    const year = String(date.getFullYear());
    const month = _m < 10 ? '0' + String(_m) : String(_m);
    const day = _d < 10 ? '0' + String(_d) : String(_d);
    const hour = _h < 10 ? '0' + String(_h) : String(_h);
    const minute = _M < 10 ? '0' + String(_M) : String(_M);
    const second = _s < 10 ? '0' + String(_s) : String(_s);
    const milesecond = _l < 10 ? '00' + String(_l) : _l < 100 ? '0' + String(_l) : String(_l);
    while (char) {
        let parsed = false;
        if (`${char}` == '%') {
            parsed = true;
            advance();
            if (char == 'Y') {
                result += year;
            }
            else if (char == 'y') {
                result += year.slice(2, 3);
            }
            else if (char == 'm') {
                result += month;
            }
            else if (char == 'd') {
                result += day;
            }
            else if (char == 'H') {
                result += hour;
            }
            else if (char == 'M') {
                result += minute;
            }
            else if (char == 'S') {
                result += second;
            }
            else if (char == 'l') {
                result += milesecond;
            }
            else {
                parsed = false;
            }
        }
        if (!parsed) {
            result += char;
        }
        advance();
    }
    return result;
}

class Logger {
    log;
    errorLog;
    stream;
    errorStream;
    constructor(log, errorLog) {
        this.log = '';
        this.errorLog = '';
        if (log) {
            this.log = path.resolve(log);
            this.errorLog = path.resolve(errorLog ?? `${path.dirname(this.log)}/error_${path.basename(this.log)}`);
            this.createLog();
        }
    }
    createLog() {
        const options = {
            encoding: 'utf-8',
            autoClose: true,
            flags: 'w'
        };
        if (this.log) {
            fs.mkdirSync(path.dirname(this.log), { recursive: true });
            let canRecordLog = false;
            try {
                fs.accessSync(this.log, fs.constants.W_OK);
                canRecordLog = true;
            }
            catch (err) {
                if (String(err).includes('no such file or directory')) {
                    canRecordLog = true;
                }
            }
            if (canRecordLog) {
                this.stream = fs.createWriteStream(path.resolve(this.log), options);
                this.success('Log file is created in %s', this.log);
            }
            else {
                this.error('Could not create log file');
            }
        }
        if (this.errorLog) {
            fs.mkdirSync(path.dirname(this.errorLog), { recursive: true });
            let canRecordLog = false;
            try {
                fs.accessSync(this.errorLog, fs.constants.W_OK);
                canRecordLog = true;
            }
            catch (err) {
                if (String(err).includes('no such file or directory')) {
                    canRecordLog = true;
                }
            }
            if (canRecordLog) {
                this.errorStream = fs.createWriteStream(path.resolve(this.errorLog), options);
                this.success('Error log file is created in %s', this.errorLog);
            }
            else {
                this.error('Could not create error log file');
            }
        }
    }
    basePrint(content, isError) {
        if (isError) {
            process.stderr.write(content + '\n');
            return;
        }
        process.stdout.write(content + '\n');
    }
    get logFile() {
        return this.log;
    }
    set logFile(v) {
        this.log = v;
        this.close();
        this.createLog();
    }
    get errorLogFile() {
        return this.errorLog;
    }
    set errorLogFile(v) {
        this.log = v;
        this.close();
        this.createLog();
    }
    logIsWritable() {
        return Boolean(this.stream?.writable) && Boolean(this.errorStream?.writable);
    }
    writeLog(content, isError) {
        if (this.logIsWritable()) {
            content = content.replaceAll(/\x1B\[.{0,2}[mJ]/g, '');
            this.stream?.write(content);
            this.stream?.write('\n');
            if (isError) {
                this.errorStream?.write(content);
                this.errorStream?.write('\n');
            }
        }
    }
    close(newLogFilename, newErrorLogFilename) {
        if (this.logIsWritable()) {
            this.stream?.close();
            this.errorStream?.close();
            if (newLogFilename) {
                fs.rename(this.log, formatDate(newLogFilename), () => { });
            }
            if (newErrorLogFilename) {
                fs.rename(this.errorLog, formatDate(newErrorLogFilename), () => { });
            }
        }
    }
    static buildLogRecord(content, level = LogLevel.info, ...formatting) {
        const recordingTime = `[${formatDate('%Y-%m-%d %H:%M:%S.%l')}]`;
        switch (level) {
            case LogLevel.error:
                return console.color(Color.fBlack, Color.bBlue, `${recordingTime}[ERROR] ${utils.format(content, ...formatting)}`);
            case LogLevel.failure:
                return console.color(Color.fRed, Color.bBlue, `${recordingTime}[FAILURE] ${utils.format(content, ...formatting)}`);
            case LogLevel.success:
                return console.color(Color.fGreen, `${recordingTime}[SUCCESS] ${utils.format(content, ...formatting)}`);
            case LogLevel.warning:
                return console.color(Color.fYellow, `${recordingTime}[WARNING] ${utils.format(content, ...formatting)}`);
            case LogLevel.debugging:
                return console.color(Color.fBlue, `${recordingTime}[DEBUGGING] ${utils.format(content, ...formatting)}`);
            default:
                return `${recordingTime}[INFO] ${utils.format(content, ...formatting)}`;
        }
    }
    print(content, level = LogLevel.info, ...formatting) {
        const record = Logger.buildLogRecord(content, level, ...formatting);
        if (level == LogLevel.error) {
            this.basePrint(record, true);
            this.writeLog(record, true);
            return;
        }
        this.basePrint(record);
        this.writeLog(record);
    }
    info(content, ...formatting) {
        return this.print(content, LogLevel.info, ...formatting);
    }
    error(content, ...formatting) {
        return this.print(content, LogLevel.error, ...formatting);
    }
    errorHappens(error) {
        return this.print(`Error caught: %s\nCause: %s\nTraceback: %s\n%s`, LogLevel.error, error.message, error.cause, error.message, error.stack);
    }
    warning(content, ...formatting) {
        return this.print(content, LogLevel.warning, ...formatting);
    }
    failure(content, ...formatting) {
        return this.print(content, LogLevel.failure, ...formatting);
    }
    success(content, ...formatting) {
        return this.print(content, LogLevel.success, ...formatting);
    }
    debugging(content, ...formatting) {
        return this.print(content, LogLevel.debugging, ...formatting);
    }
}

function getLogger(log, errorLog) {
    if (!global.logger) {
        global.logger = new Logger(log, errorLog);
        process.prependListener('beforeExit', () => {
            if (global.logger && global.logger instanceof Logger) {
                const log = path$1.basename(global.logger.logFile);
                const errorLog = path$1.basename(global.logger.errorLogFile);
                const logFolder = path$1.dirname(global.logger.logFile);
                const errorLogFolder = path$1.dirname(global.logger.errorLogFile);
                global.logger.close(path$1.resolve(logFolder, '%Y-%m-%d_%H-%M-%S_' + log), path$1.resolve(errorLogFolder, '%Y-%m-%d_%H-%M-%S_' + errorLog));
            }
        });
    }
    return global.logger;
}

var index = {
    logger: Logger,
    getLogger
};

module.exports = index;
//# sourceMappingURL=logger4node.js.map
