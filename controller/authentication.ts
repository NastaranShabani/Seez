import express from "express";
import { getUserByEmail,createUser } from "../models/user";
import { authentication, random } from "../helper";

export const register = async (req:express.Request, res:express.Response) => {
  try {
    const { username, email, password, superuser } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !username || superuser === undefined || typeof superuser !== 'boolean') {
       return res.status(400).send("All input is required");
    }
  if(!emailRegex.test(email)) {
    return res.status(409).send("Email is not in correct format");
  }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const salt = random();
     const user = await createUser({
      username,
      email: email.toLowerCase(),
      superuser: req.body.superuser || false,
      salt,
      password: authentication(salt,password),
    });
    return res.status(201).json(user).end();
} catch (err) {
console.log(err);
return res.sendStatus(400);
}
}

export const login = async (req:express.Request, res:express.Response) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.sendStatus(400);
    }
    const user = await getUserByEmail(email.toLowerCase()).select("+salt +password");
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const createdHash = authentication(user?.salt,password);
    
    if(user.password !== createdHash) {
        return res.status(403).json({error:"password is not valid"});
    }
    const salt = random();
    user.sessionToken = authentication(salt, user._id.toString());
    await user.save();
    res.cookie("AUTH_COOKIE", user.sessionToken , {domain:"localhost", path:"/"})
    return res.status(201).json(user).end();
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}