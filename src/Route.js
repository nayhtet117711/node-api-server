const Middleware = require("./Middleware")

class Route {
    constructor(expressApp) {
        this.expressApp = expressApp

    }

    setup(config={}) {
        // routes here

        this.expressApp.get("/hello", (req, res) => {

            res.json({ message: "Hello ..."})
        })

        this.expressApp.use(Middleware.useErrorHandlerMiddleware)
    }

}

module.exports = Route