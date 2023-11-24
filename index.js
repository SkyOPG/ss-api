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

async function ensureAuth(req, res, next){
    const { username, password } = req.body || req.query;

    const isTaken = await usernames.get(username);
    if(!isTaken)
        return res.status(404).send("the user doesn't exist")

    const pass = await bcrypt.compare(password, isTaken);
    if(!pass)
        return res.status(401).send("Wrong password");

    next();
}

const config = fs.existsSync("ss-srv.yml")
    ? yaml.parse(fs.readFileSync("ss-srv.yml"))
    : logExit("No ss-srv.yml found, exiting...");

const usernames = new QuickDB({
    filePath: "clouds.db",
    table: "usernames"
})

const clouds = new QuickDB({
    filePath: "clouds.db",
    table: "clouds"
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

app.post("/login", ensureAuth ,async function(req, res){
    return res.status(200).send("Correct!")
});

app.get("/clouds/get", async function(req, res){
    const { cloud } = req.query;
    const cloudQuery = await clouds.get(cloud);

    if(!cloudQuery)
        return res.status(404).send("Not found");

    return fs.existsSync("./clouds/"+cloud+".ssx")
        ? res.status(200)
            .send({
                file: fs.readFileSync(`./clouds/${cloud}.ssx`),
                name: cloud,
                cloudQuery
            })
        : res.status(500)
            .send("Error: Database seems to have issues finding the package")
})

app.post("/clouds")
app.listen(config.port, console.log(
    "ready on ::"
        + config.port
    )
);