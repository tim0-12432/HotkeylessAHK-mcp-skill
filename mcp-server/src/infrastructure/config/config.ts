
export type Config = {
    baseUrl: string;
    timeoutMs: number;
    blacklist: string[];
    cache: {
        ttlMs: number;
    };
    endpoints: {
        list: string;
        trigger: string;
    };
}

const defaultConfig: Config = {
    baseUrl: 'http://localhost:42800',
    timeoutMs: 4000,
    blacklist: [],
    cache: {
        ttlMs: 5000,
    },
    endpoints: {
        list: '/list',
        trigger: '/send',
    },
};

function getFromEnvOrDefault<T>(envVar: string, defaultValue: T): T {
    const val = process.env[envVar]
    if (val === undefined) {
        return defaultValue;
    }
    return val as unknown as T;
}

export function loadConfig(): Config {
    return {
        baseUrl: getFromEnvOrDefault('BASE_URL', defaultConfig.baseUrl),
        timeoutMs: getFromEnvOrDefault('TIMEOUT_MS', defaultConfig.timeoutMs),
        blacklist: (process.env.BLACKLIST ?? defaultConfig.blacklist.join(',')).split(',').map((s) => s.trim()).filter((s): s is string => !!s),
        cache: {
            ttlMs: getFromEnvOrDefault('CACHE_TTL_MS', defaultConfig.cache.ttlMs),
        },
        endpoints: {
            list: getFromEnvOrDefault('ENDPOINT_LIST', defaultConfig.endpoints.list),
            trigger: getFromEnvOrDefault('ENDPOINT_TRIGGER', defaultConfig.endpoints.trigger),
        },
    };
}
