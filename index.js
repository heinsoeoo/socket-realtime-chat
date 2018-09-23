const Fs = require('fs');
const ENV = JSON.parse(Fs.readFileSync("env.json"));
const URLEndPoint = require('./modules/url-end-point');
const knex = require("knex");
const Model = require('tneuqole');
const User = require('./modules/User');
const socketIO = require('socket.io');

class App {
	constructor(env){
		this.env = env;
		Model.setup(knex({client:"mysql", connection:this.env.mysql}));
	}

	async run(){
		const urlep = new URLEndPoint(5000, '192.168.1.7');
		urlep.run();
	}
}

global.app = new App(ENV);
global.app.run();