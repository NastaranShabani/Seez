// const express = require("express");
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http"
import router from "./router";

const app = express();
app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());
dotenv.config();
const server = http.createServer(app);
const MONGO_URL = "mongodb+srv://shabaninastaran8:Nastaran123@cluster0.qau6gxg.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error",(error:Error) => console.log(error));
app.use("/", router());

server.listen(8001, () => {
      console.log('Listening on PORT 8001')
}) 
 