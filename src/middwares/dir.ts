import { Context, Next } from 'koa';
import path from 'path';
import fs from 'fs';
import { ROOT, template } from '../config';
import { mapFileType } from '../utils';

export const dir = async (ctx: Context, next: Next) => {
	const filepath = path.join(ROOT, ctx.path);

	try {
		const stats = fs.statSync(filepath);

		if (!stats.isDirectory()) {
			return next();
		}

		const dirs = fs.readdirSync(filepath);
		ctx.status = 200;
		ctx.headers['content-type'] = 'text/html';

		const data: {
			name: string;
			url: string;
			isDir: boolean;
			isJavascript: boolean;
			isImage: boolean;
			other: boolean;
		}[] = [];

		let url = '';
		let ext = '';

		dirs.forEach(file => {
			url = ctx.path.endsWith('/') ? ctx.path + file : ctx.path + '/' + file;
			ext = path.extname(url);
			let { isPic, isJs, isOther, isFile } = mapFileType(ext);

			data.push({
				name: file,
				url,
				isDir: !isFile,
				isJavascript: isJs,
				isImage: isPic,
				other: isOther,
			});
		});

		ctx.body = template({
			title: ctx.path === '/' ? 'root' : ctx.path,
			data,
		});
	} catch (error) {
		ctx.body = error;
	}
};
