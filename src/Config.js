module.exports = {
    defaultPort: 3003,
    defaultServerName: "NodeJs API Server",
    defaultHost: "localhost",

    Response: ({ success = true, error = null, payload = null }) => {
        return ({ success, error, payload })
    }


}