const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {
    constructor(db) {
       this.db = db;
    }

    async register(name, mobile, password, address) {
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const userCheck = await this.db.get(`SELECT * FROM users WHERE name = '${name}'`);

            if (userCheck) {
                throw new Error("User Already Exists");
            }

            const addData =  `INSERT INTO users (name,password,mobile,address) VALUES('${name}','${hashPassword}',${mobile},'${address}')`;
            const dbResponse = await this.db.run(addData);
            const userId = dbResponse.lastID;
            return `Successfully created new user with ID ${userId}`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(name, password) {
        try {
            const userExists = await this.db.get(`SELECT * FROM users WHERE name = '${name}'`);

            if (!userExists) {
                throw new Error("User Not Found");
            }

            const matchedPassword = await bcrypt.compare(password, userExists.password);

            if (matchedPassword) {
                const payload = { username: name };
                const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
                return { jwtToken };
            } else {
                throw new Error("Invalid Password");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

   
}

module.exports = User;
