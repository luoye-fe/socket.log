// 链接socket
// var socket = io('http://localhost:5555');
var socket = io();

var btn = document.getElementById('btn');
var code = document.getElementById('code');

btn.addEventListener('click', function() {
	socket.emit('run', '哈哈哈');
})

socket.on('begin', function(data) {
	console.log(data);
	code.innerHTML += data + '<br><br>';
})

socket.on('runing', function(data) {
	console.log(data);
	code.innerHTML += data;
	// 置底
	document.querySelectorAll('.cmd-box')[0].scrollTop = document.querySelectorAll('.cmd-box')[0].scrollHeight
})

socket.on('block', function(data) {
	alert('正在操作中！');
})

socket.on('close', function(data) {
	code.innerHTML += '\n操作结束\n\n\n';
})