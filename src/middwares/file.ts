import { Context, Next } from 'koa';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import zlib from 'zlib';
import { isFresh } from '../utils';
import { ROOT, compressed } from '../config';

export const file = async (ctx: Context, next: Next) => {
	const filepath = path.join(ROOT, ctx.path);

	try {
		const stats = fs.statSync(filepath);

		if (!stats.isFile()) {
			return next();
		}

		// 如果是文件
		const mineType = mime.getType(path.extname(filepath));
		ctx.headers['content-type'] = mineType as string;
		ctx.status = 200;

		if (isFresh(stats, ctx)) {
			// 存在缓存
			ctx.status = 304;
			ctx.body = 'success';
		}

		// 创建可读流
		const rs = fs.createReadStream(filepath);
		// 是否需要压缩
		const encoding = ctx.headers.accept?.trim().split(',');
		if (
			encoding &&
			compressed.test(path.extname(filepath)) &&
			encoding.length
		) {
			let compressType = '';
			let compress = null;
			if (encoding.includes('gzip')) {
				// 优先gzip
				compressType = 'gzip';
				compress = zlib.createGzip();
			} else if (encoding.includes('deflate')) {
				// 其次deflate
				compressType = 'deflate';
				compress = zlib.createDeflate();
			} else {
				// 否则不压缩
			}
			ctx.headers['content-encoding'] = compressType;
			if (compress) {
				rs.pipe(compress);
			}
		}

		ctx.body = rs;
	} catch (error) {
		ctx.body = error;
	}
};
