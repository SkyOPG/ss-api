const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { QuickDB } = require('quick.db');

const logExit = (a, b = 1) => {
    console.log(a);
    process.exit(b);
}

const config = fs.existsSync("ss-srv.yml")
    ? yaml.parse(fs.readFileSync("ss-srv.yml"))
    : logExit("No ss-srv.yml found, exiting...");

const usernames = new QuickDB({
    filePath: "clouds.db",
    table: "usernames"
})

app.use(express.json());

app.post("/signup", async function(req, res){
    const { username, password } = req.body;

    const isTaken = await usernames.get(username);
    if(!isTaken){
        usernames.set(username, bcrypt.hash(password))
        return res.status(200).send("Account created!")
    } else {
        return res.status(401).send("Unauthorized");
    }
});

app.post("/login", async function(req, res){
    const { username, password } = req.body;

    const isTaken = await usernames.get(username);
    if(!isTaken)
        return res.status(404).send("the user doesn't exist")

    const pass = bcrypt.compare(password, isTaken)
})

app.listen(config.port, console.log(
    "ready on ::"
        + config.port
    )
);