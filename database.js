import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const pool= mysql.createPool({
    host: process.env.MYSQL_HOST,  //env variables ensure that sensitive information is not hardcoded into the codebase, enhancing security and flexibility.
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();
//print the entire table
export async function getData(){
    const [rows]= await pool.query('SELECT * FROM users');
   return rows;
}
// const note = await  getData();
// console.log(note);
//now we'll try to get a singular user email by its id
export async function getUserByEmail(email){
    const [rows]= await pool.query('SELECT * FROM users WHERE email=?',[email]);
    return rows[0];
}

export async function getUserById(id){
     const [rows]= await pool.query('SELECT * FROM users WHERE id=?',[id]);
    return rows[0];
}

//noow we'll create a user
export async function createUser(
    name,
    email,
    hashedPassword,
    phone,
    age,
    bio,
    role
){
    const [result] = await pool.query(
        `INSERT INTO users
        (name, email, password, phone, age, bio,role)
        VALUES (?, ?, ?, ?, ?, ?,?)`,
        [name, email, hashedPassword, phone, age, bio,role]
    );

    return result.insertId;
}

//update name, phone, age, bio
export async function UpdateById(id, name, phone, age, bio,role){
    const [rows]= await pool.query('UPDATE users SET name= ?, phone=?, age= ?, bio= ? , role=? WHERE id= ?',[name, phone, age, bio,role,id]);
    return rows[0];
}
export async function DeleteUser(id){
    const[rows]=await pool.query('DELETE FROM users WHERE id=?',[id])
}
export async function UpdatePasswordById(id,hashedPassword){
    const [rows]= await pool.query('UPDATE users SET password= ? WHERE id= ?',[hashedPassword,id]);
    return rows[0];
}
//  const newUser = await createUser('mynewemail@example.com', 'newpassword');
//  console.log(newUser);