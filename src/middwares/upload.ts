import { Context, Next } from 'koa';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import { ROOT } from '../config';

if (!fs.existsSync('upload')) {
	fs.mkdirSync('upload');
}

export const upload = async (ctx: Context, next: Next) => {
	if (ctx.path === '/api/upload' && ctx.method === 'POST') {
		// 获取上传文件
		const files = ctx.request.files;
		const root = ctx.request.body.root;

		if (files) {
			const file = files.file as formidable.File;

			if (file.name) {
				// 创建可读流
				const reader = fs.createReadStream(file.path);
				// 创建可写流
				const upStream = fs.createWriteStream(path.join(ROOT, root, file.name));
				// 可读流通过管道写入可写流
				reader.pipe(upStream);
				ctx.body = file;
			} else {
				ctx.body = 'no';
			}
		} else {
			ctx.body = 'no';
		}
	} else {
		await next();
	}
};
