const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");

const User = require("./models/Users");
const DiaryEntry = require("./models/DiaryEntry")

require('dotenv').config();
const port = 3000;


app.use(express.json());


 // Start server
 app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});

let db;

// Define async function to open database and start server
const initlizeServer = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, "users.db"),
            driver: sqlite3.Database
        });
        console.log("Database connected successfully");

        const user = new User(db); // Create User instance after database connection is established
        const diaryEntry = new DiaryEntry(db); // Create dairy instance after database connection is established

       
        
        app.post("/register", async (request, response) => {
            const { name, mobile, password, address } = request.body;
            try {
                const result = await user.register(name, mobile, password, address);
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
        });

        app.post("/login", async (request, response) => {
            const { name, password } = request.body;
            try {
                const result = await user.login(name, password);
                response.send(result);
            } catch (error) {
                response.status(401).send(error.message);
            }
        });


        const middleware = (request, response, next) => {
            const authorizationHeader = request.headers.authorization;
            if (!authorizationHeader) {
                response.status(401).send("Invalid JWT token");
            } else {
                const jwtToken = authorizationHeader.split(" ")[1];
                jwt.verify(jwtToken, "MY_SECRET_KEY", (error, payload) => {
                    if (error) {
                        response.status(401).send("Invalid JWT Token");
                    } else {
                        request.username = payload.username;
                        next();
                    }
                });
            }
        };
        
       
        app.post("/createDairyEntrie", middleware, async(request, response) => {
            const {title,description,date} = request.body
            try {
                const result = await diaryEntry.create(title,description,date);
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
           
        });

        app.put("/updateDairyEntrie/:id", middleware, async(request, response) => {
            const {title,description,date} = request.body
            const {id} = request.params
            try {
                const result = await diaryEntry.update(title,description,date,id);
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
           
        });

        app.delete("/deleteDairyEntrie/:id", middleware, async(request, response) => {
           
            const {id} = request.params
            try {
                const result = await diaryEntry.delete(id);
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
           
        });

        app.get("/getDairyEntries", async(request, response) => {

            try {
                const result = await diaryEntry.read();
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
           
        });

       
    } catch (error) {
        console.error(`DB error: ${error.message}`);
        process.exit(1);
    }
};


initlizeServer();
