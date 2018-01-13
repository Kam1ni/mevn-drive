const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const defaultServerFile = {
	host: "localhost",
	port: 3000,
	fileDir: path.resolve(__dirname, "../files"),
	db:{
		host: "mongodb://localhost:27017",
		username: "NOT YET IMPLEMENTED",
		password: "NOT YET IMPLEMENTED"
	} 
}

const defaultAuthFile = {
	users: [
		{username: "admin", password: "admin", isAdmin: true, _id: mongoose.Types.ObjectId()}
	]
}

function createFileIfNotExist(filename, config){
	if (!fs.existsSync(path.resolve(__dirname, "../config/", filename + ".json"))){
		fs.writeFileSync(path.resolve(__dirname, "../config/", filename + ".json"), JSON.stringify(config, null, 2));
	}
}

module.exports = function(){
	if (!fs.existsSync(path.resolve(__dirname, "../config"))){
		fs.mkdirSync(path.resolve(__dirname, "../config"));
	}
	createFileIfNotExist("server", defaultServerFile);
	createFileIfNotExist("auth", defaultAuthFile);
}