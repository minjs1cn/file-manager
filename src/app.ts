import Koa from 'koa';
import { port } from './config';
import { dir, file } from './middwares';

const app = new Koa();

app.use(file);
app.use(dir);

app.use(async ctx => {
	ctx.status = 200;
	ctx.body = 'Not a File or Directory';
});

app.listen(port, () => {
	console.log(`listen at ${port}`);
});
