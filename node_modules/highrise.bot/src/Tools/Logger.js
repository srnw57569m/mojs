const ANSI = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    white: '\x1b[37m',
    bold: '\x1b[1m',
    magenta: '\x1b[35m'
}

const LEVELS = {
    debug: { color: ANSI.magenta, label: '[DEBUG]', weight: 0 },
    info:  { color: ANSI.cyan,    label: '[INFO]',  weight: 1 },
    warn:  { color: ANSI.yellow,  label: '[WARN]',  weight: 2 },
    error: { color: ANSI.red,     label: '[ERROR]', weight: 3 },
}

const gray = (str) => `${ANSI.gray}${str}${ANSI.reset}`

class Logger {
    constructor(prefix = 'Highrise', level = 'debug') {
        if (typeof prefix !== 'string' || !prefix.trim()) {
            throw new Error('[Logger] prefix must be a non-empty string')
        }
        
        if (!LEVELS[level]) {
            throw new Error(`[Logger] invalid level "${level}"`)
        }

        this.prefix = prefix
        this.level = level
    }

    #time() {
        return new Date().toTimeString().slice(0, 8)
    }

    #format(a) {
        if (a instanceof Error) return `${a.name}: ${a.message}`
        if (typeof a === 'object' && a !== null) {
            try { return JSON.stringify(a) } catch { return '[Unserializable]' }
        }
        return String(a)
    }

    #log(level, category, ...args) {
        if (LEVELS[level].weight < LEVELS[this.level].weight) return

        const { color, label } = LEVELS[level]
        const prefix = `${ANSI.bold}${ANSI.white}[${this.prefix}]${ANSI.reset}`
        const sep = gray('│')
        const time = gray(this.#time())
        const lvl = `${color}${label}${ANSI.reset}`
        const cat = `${color}${category}${ANSI.reset}`
        const msg = args.map(a => this.#format(a)).join(` ${gray('·')} `)

        let line = `${prefix} ${sep} ${time} ${sep} ${lvl} ${sep} ${cat}`
        if (msg) line += ` ${sep} ${msg}`

        const out = level === 'error' ? console.error : console.log
        out(line)
    }

    info(category, ...args) { this.#log('info', category, ...args) }
    warn(category, ...args) { this.#log('warn', category, ...args) }
    error(category, ...args) { this.#log('error', category, ...args) }
    debug(category, ...args) { this.#log('debug', category, ...args) }

    setLevel(level) {
        if (!LEVELS[level]) throw new Error(`[Logger] invalid level "${level}"`)
        this.level = level
    }
}

module.exports = Logger