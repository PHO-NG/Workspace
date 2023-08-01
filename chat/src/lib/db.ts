import {Redis} from "@upstash/redis"

// export const db = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL,
//     token: process.env.TOKEN,
//    });

export const db = Redis.fromEnv()