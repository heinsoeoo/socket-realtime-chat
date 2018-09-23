const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const User = require("./User");
const bodyParser = require("body-parser");
const socketIO = require('socket.io');
const users = [];

class URLEndPoint {
	constructor(port, host){
		this.port = port;
		this.host = host;
		this.setup();
		this.method();
		this.errorHandler();
	}

	setup(){
		this.app = express();
		this.app.engine('.hbs', exphbs({
			defaultLayout: "main",
			extname: ".hbs",
			layoutDir: path.join(__dirname, '../views/layouts')
		}));
		this.app.set("view engine", ".hbs");
		this.app.set("views", path.join(__dirname, "../views"));
		this.app.use(bodyParser.urlencoded({
		    extended: true
		}));
		this.app.use(bodyParser.json());
		this.app.use(express.static(path.join(__dirname, '../public')));
	}

	errorHandler(){
		this.app.use((err, req, res, next) => {
			if(err){
				console.log(err);
				res.status(500).send("Something broken!");
			}
		});
	}

	async method(){
		this.app.get('/', (req, res) => {
			res.render('home', {
				name: "Node.js!"
			});
		});

		this.app.get('/chat-room', (req, res) => {
			var scripts = [
				{script: "/js/socket.io.js"},
				{script: "/js/socket-client.js"}
			];
			var audio = "/audio/plucky.mp3";
			res.render('chat-room', {
				name: this.name,
				scripts: scripts,
				audio: audio
			});
			this.name = '';
		});

		this.app.post('/enter-room', (req,res) => {
			const data = req.body;
			this.name = data.name;
			this.age = data.age;
			res.status(200).redirect('/chat-room');
		})
	}

	run(){
		var server = this.app.listen(this.port, this.host, () => {
			console.log("listing on port: "+this.port);
		});

		var io = socketIO.listen(server);

		io.on('connection', function (socket) {
			socket.emit('welcome', { data: 'welcome' });
			socket.on('my other event', function (data) {
				var id = socket.id;
				users[id] = data.name;
				if (data.name.length <= 0){
					socket.emit('reload');
				}
				console.log(users);
			});

			socket.on('send-message', function (data) {
				console.log(users);
				data.name = users[socket.id];
				// io.sockets.emit('send-message', data);
				socket.broadcast.emit('send-message', data);
            });

			socket.on('typing', function () {
				socket.broadcast.emit('typing');
            });

            socket.on('stop-typing', function () {
                io.sockets.emit('stop-typing');
            });
		});

	}
}

module.exports = URLEndPoint;