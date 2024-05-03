const {createClient} = require('redis')

const redis = createClient()

const connectRedis = async () => {
    await redis.connect()
}

const getCachedData = async (key) => {
    const value = await redis.get(key)

    return value ? JSON.parse(value) : null
}

const setCachedData = async (key, value) => {
    await redis.set(key, JSON.stringify(value))
}

const deleteCachedData = async (key) => {
    await redis.del(key)
}

module.exports = {redis, connectRedis, getCachedData, setCachedData, deleteCachedData}