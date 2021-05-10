const Server = require("./src/Server")

const init = async () => {
    const server = new Server({})
    await server.start()
    server.setupRoutes()
}

module.exports = init()