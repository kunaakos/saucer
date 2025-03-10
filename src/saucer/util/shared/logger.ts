export const LOG_LEVEL = {
    SILENT: 100,
    FATAL: 60,
    ERROR: 50,
    WARN: 40,
    INFO: 30,
    DEBUG: 20,
    TRACE: 10,
}

export const colors = {
    reset: '\x1b[0m',
    redBg: '\x1b[41m',
    yellowBg: '\x1b[43m',
    greenBg: '\x1b[42m',
    blueBg: '\x1b[44m',
    whiteBg: '\x1b[47m',
}

const colorize = (str: string, color: string) => `${color}${str}${colors.reset}`

type MakeLoggerArgs = {
    serviceLabel: string
    logLevel: number
}

const ifAboveOrEqual = (treshold: number, logLevel: number, fn: (arg: any) => void) =>
    logLevel <= treshold ? fn : () => {}

export const makeLogger = ({ serviceLabel, logLevel }: MakeLoggerArgs) => {
    const colorizedServiceLabel = colorize(` ${serviceLabel} `, colors.blueBg)

    const trimError = (message: string) => (message.startsWith('Error: ') ? message.substring(7) : message)
    const header = (message: string, level: string) => `${colorizedServiceLabel}${level} ${message}`
    const stackTrace = (stackTraceLines: string[]) =>
        stackTraceLines.map((line) => `  > ${line.trim().substring(3)}`).join('\n')

    return {
        trace: ifAboveOrEqual(LOG_LEVEL.TRACE, logLevel, (msg: string) => {
            console.log(`${header(msg, colorize(' TRC ', colors.whiteBg))}`)
        }),
        debug: ifAboveOrEqual(LOG_LEVEL.DEBUG, logLevel, (msg: string) => {
            console.log(`${header(msg, colorize(' LOG ', colors.whiteBg))}`)
        }),
        info: ifAboveOrEqual(LOG_LEVEL.INFO, logLevel, (msg: string) => {
            console.log(`${header(msg, colorize(' INF ', colors.greenBg))}`)
        }),
        warn: ifAboveOrEqual(LOG_LEVEL.WARN, logLevel, (msg: string) => {
            console.log(`${header(msg, colorize(' WRN ', colors.yellowBg))}`)
        }),
        error: ifAboveOrEqual(LOG_LEVEL.ERROR, logLevel, (errOrMsg: string | Error) => {
            if (typeof errOrMsg === 'string') {
                console.log(`${header(errOrMsg, colorize(' ERR ', colors.redBg))}`)
            } else if (errOrMsg.stack) {
                const [errorMessage, ...stackTraceLines] = errOrMsg.stack.split('\n')
                console.log(
                    `${header(errorMessage ? trimError(errorMessage) : '?', 'ERR')}\n${stackTrace(stackTraceLines)}`,
                )
            }
        }),
    }
}
