const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const port = 3003
const name = "Delimoo API"

const app = express()

app.use((req, res, next) => {
    // console.log(`Pid: ${process.pid}`)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const http = require("http").createServer(app)

http.listen(port, error => {
    if (error) {
        return console.log(`${name} failed to start at port ${port} due to ${error.toString()}. `, error)
    }
    console.log(`${name} started at port ${port}.`)

    setupRoutes()

    tryMongoDb()
})

const setupRoutes = () => {
    app.get("/ping", (req, res, next) => res.send("PONG"))
}

const tryMongoDb = () => {
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');

    const url = 'mongodb://localhost:27017';
    const dbName = 'test';
    const client = new MongoClient(url, { useUnifiedTopology: true });

    client.connect((err) => {
        assert.equal(null, err);
        console.log('Connected to MongoDB server.');

        const db = client.db(dbName);

        const mcollections = db.collection("mcollections")
        const findData = () => {
            const cursor = mcollections.find({})
            cursor.toArray()
                .then(data => {
                    console.log("Data>mcollections.find({}): ", data)
                })
                .catch(error => {
                    console.log("Error>mcollections.find({}): ", error)
                })
        }

        mcollections.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log('Inserted 3 documents into the collection');
            findData()
        });
        


        setTimeout(() => {
            client.close();
            console.log('Closed MongoDB server.');
        }, 5000)
    });

}