const Config = require("./Config.js")

module.exports.requestLogging = (req, res, next) => {
    console.log("Incoming -> ", new Date(), " ", req.method, " ", req.url, " ", req.body)
    next()
}

module.exports.useErrorHandlerMiddleware = (error, req, res, next) => {
    if (!error) return next()
    console.error("ErrorHandlerMiddleware: \n", error.stack)
    return res.json(Config.Response({
        success: false,
        error: error.message
    }))
}