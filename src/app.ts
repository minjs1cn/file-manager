import Koa from 'koa';
import { port } from './config';
import { auth, dir, file, login, upload } from './middwares';
import koaBody from 'koa-body';

const app = new Koa();

app.use(
	koaBody({
		multipart: true,
		formidable: {
			maxFileSize: 500 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
			uploadDir: 'upload',
			keepExtensions: true,
		},
	}),
);
app.use(login);
app.use(auth);
app.use(upload);
app.use(file);
app.use(dir);

app.use(async ctx => {
	ctx.status = 200;
	ctx.body = 'Not a File or Directory';
});

app.listen(port, () => {
	console.log(`listen at ${port}`);
});
