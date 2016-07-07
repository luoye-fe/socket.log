import fs from 'fs';
import path from 'path';
import http from 'http';
import { exec,spawn } from 'child_process';

import Koa from 'koa';
import Static from 'koa-static';
import Router from 'koa-router';

// koa1中间件转换
import convert from 'koa-convert';

const app = new Koa();
const httpPort = 5555;

// socket.io
import Socket from 'socket.io';
var server = http.createServer(app.callback());
var io = Socket(server);

let block = false;
io.on('connection', (socket) => {
	socket.on('run', (data) => {
		if (block) {
			socket.emit('block');
			console.log('正在操作中');
			return;
		}
		// let cmd = `cd /Users/loye/Documents/gome/venus-csh-web && git checkout dev && git pull origin dev && git checkout -b test-${Date.now()} && npm run buildall`;
		let cmd = `rm -rf ./node_modules && npm install -d`;
		block = true;
		const runInstance = exec(cmd);
		io.sockets.emit('begin', cmd);
		runInstance.on('close', (code) => {
	  		console.log(`Child exited with code ${code}`);
	  		io.sockets.emit('close', code);
	  		block = false;
		});
		runInstance.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
			io.sockets.emit('runing', data);
		})
		runInstance.stderr.on('data', (data) => {
			console.log(`stdout: ${data}`);
			io.sockets.emit('runing', data);
		})
	})
});

const router = Router();

router.get('/', async (ctx, next) => {
	ctx.body = fs.readFileSync('./view/index.html', 'utf-8');
})

app.use(router.routes(), router.allowedMethods());

// static
app.use(convert(Static(path.join(__dirname, 'static'))));

server.listen(httpPort);

console.log(`server listening on ${httpPort}`);
