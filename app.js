import express from "express";
import jwt from "jsonwebtoken";
import {getData,getUserByEmail, createUser, UpdateById, DeleteUser, UpdatePasswordById, getUserById} from './database.js';
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

function authenticateToken(req, res, next) {
const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(" ")[1];
if (!token) {
    return res.sendStatus(401);
}

jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
   if (err) {
    console.log(err);
    return res.status(403).json({
        message: err.message
    });
}
    req.user = user;
    next();
});

}
app.get("/profile", authenticateToken, async (req, res) => {
    try{
     const data = await getUserById(req.user.id);
     delete data.password;
    res.json({
    message: "Profile fetched successfully",
    user: data
});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


app.put("/profile", authenticateToken, async (req, res) => {
    try{
    const {name, phone, age, bio, role} = req.body;
    const data= await UpdateById(req.user.id,name,
    phone,
    age,
    bio,
role);
    res.json({
    message: "Profile updated successfully",
    user: data
});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.delete("/profile", authenticateToken, async (req, res) => {
    try{
    const data= await DeleteUser(req.user.id);
    res.send({
        message: "User Deleted successfully"
    })
}
catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.put("/change-password", authenticateToken, async (req, res) => {
    try{
    const { oldPassword, newPassword } = req.body;
    const user = await getUserById(req.user.id);
      if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}
    const ismatch=await bcrypt.compare(oldPassword,user.password)
    if (!ismatch) {
    return res.status(400).json({
        message: "Invalid old password"
    });
}
    const hashedPassword = await bcrypt.hash(newPassword, 10);
//now update
    await UpdatePasswordById(req.user.id, hashedPassword);
      res.json({
        message: "Password updated successfully"
    });
}
catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.post("/register", async (req, res) => {
    try{
    const { name, email, password, phone, age, bio,role } = req.body;
    if (!email || !password || !name) {
    return res.status(400).json({
        message: "Proper name,email and password are required"
    });
}
    
const existingUser = await getUserByEmail(email);
if (existingUser) {

    return res.status(400).json({
        message: "Email already exists"
    });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await createUser(name,email, hashedPassword,phone, age, bio,role);
    res.status(201).json({
        message: "User created",
        id
    });
}
catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


app.post("/login", async (req, res) => {
    try{
const { email, password } = req.body;
const user = await getUserByEmail(email);
if (!user) {
    return res.status(400).json({
        message: "Invalid email or password"
    });
}
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    return res.status(400).json({
        message: "Invalid email or password"
    });
}
const token = jwt.sign( 
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);
res.json({
    message: "Login successful",
    token
});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
