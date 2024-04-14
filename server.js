const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");

const User = require("./models/Users");
const DiaryEntry = require("./models/DiaryEntry")

app.use(express.json());

const port = 3000;

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


        const middleware = (request,response,next)=>{
            let jwtToken = request.headers.authorization.split(" ")[1]
            if (jwtToken === undefined){
            response.send(401);
            response.send("Invalid JWT token");
            }
            else{
                jwt.verify(jwtToken,"MY_SECRET_KEY",(error,payload)=>{
                if(error){
                    response.status(401);
                    response.send("Invalid JWT Token");
                }
                else{
                    next()
                }
                })
            }
        }
       
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

        app.get("/getDairyEntries", middleware, async(request, response) => {

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
