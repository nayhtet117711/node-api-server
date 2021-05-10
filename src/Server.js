const Config = require("./Config.js")
const Middleware = require("./Middleware.js")

class Server {

    constructor({port, serverName, host}) {
        this.port = port || Config.defaultPort
        this.serverName = serverName || Config.defaultServerName
        this.host = host || Config.defaultHost

        const express = require("express")
        this.expressApp = express()
        this.httpServer = require("http").createServer(this.expressApp)

        this.setupCors()
        this.setupParser()
    }

    start() {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(this.port, this.host, error => {
                if (error) {
                    console.log(`${this.serverName} failed to start at port ${this.port} on ${this.host}`)
                    return reject(error)
                }
                console.log(`${this.serverName} started at port ${this.port} on ${this.host}.`)

                this.expressApp.use(Middleware.requestLogging)

                this.pingApi()

                return resolve()
            })
        })
        
    }

    pingApi() {
        console.log(`Try http://${this.host}:${this.port}/ping to check.`)
        this.expressApp.get("/ping", (req, res, next) => res.send("PONG"))
    }

    setupCors() {
        const cors = require("cors")

        this.expressApp.use((req, res, next) => {
            // console.log(`Pid: ${process.pid}`)
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        })
        this.expressApp.use(cors())
    }

    setupParser() {
        const bodyParser = require("body-parser")

        this.expressApp.use(bodyParser.urlencoded({ extended: true }))
        this.expressApp.use(bodyParser.json())
    }

    setupRoutes(config={}) {
        const Route = require("./Route.js")
        this.Router = new Route(this.expressApp, {})
        this.Router.setup(config)
    }


}

module.exports = Server