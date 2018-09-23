var socket = io.connect('http://192.168.1.7:5000');
var message = $('#message');
var btn = $('#btn');
var messages = $('#messages');
var username = $('#name').text();
var typing = $('#typing');
var audio = document.getElementById('noti');
socket.on('welcome', function (data) {
	socket.emit('my other event', { name: username });
});

// message.on('keypress',function (e) {
// 	var key = e.which;
// 	if (key == 13){
// 		sendMessage();
// 	}
// });

btn.on('click', function () {
	sendMessage();
});

function sendMessage(){
	if (message.val().length > 0) {
        socket.emit('send-message', {
            name: this.name,
            message: message.val(),
        });
        messages.append("<li class='self'><p>"+message.val()+"</p></li>");
        messages.animate({scrollTop: messages.prop("scrollHeight")}, 500);
    }
    message.val('');
}

message.on('keyup',function (e) {
    var key = e.which;
    if (key == 13){
        sendMessage();
    }else {
        socket.emit('typing');
    }
});

message.on('focusout', function () {
	socket.emit('stop-typing');
});

function noti() {
    audio.play();
}

//Listening

socket.on('send-message', function (data) {
	messages.append("<li><p><strong>"+data.name+" : </strong>"+data.message+"</p></li>");
    messages.animate({scrollTop: messages.prop("scrollHeight")}, 500);
    socket.emit('stop-typing');
    noti();
});

socket.on('typing', function () {
	typing.addClass('typing');
});

socket.on('stop-typing', function () {
	typing.removeClass('typing');
});

socket.on('reload', function () {
	location.replace('http://192.168.1.7:5000');
});