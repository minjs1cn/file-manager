import { cache } from '../config';
import fs from 'fs';
import { Context } from 'koa';

export function generateETag(stat: fs.Stats) {
	const mtime = stat.mtime.getTime().toString(16);
	const size = stat.size.toString(16);
	return `W/"${size}-${mtime}"`;
}

/**
 * 设置缓存信息
 * @param {Object} stats 文件
 * @param {Object} res 响应内容
 */
export function refreshRes(stats: fs.Stats, ctx: Context) {
	const { maxAge, expires, cacheControl, lastModified, eTag } = cache;

	if (expires) {
		ctx.headers.expires = new Date(Date.now() + maxAge * 1000).toUTCString();
	}

	if (cacheControl) {
		ctx.headers['cache-control'] = `public, max-age=${maxAge}`;
	}

	if (lastModified) {
		ctx.headers['last-modified'] = stats.mtime.toUTCString();
	}

	if (eTag) {
		ctx.headers.etag = generateETag(stats);
	}
}

/**
 * 判断缓存是否失效
 * @param {Object} stats 文件
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
export function isFresh(stats: fs.Stats, ctx: Context) {
	// 初始化
	refreshRes(stats, ctx);

	const lastModified = ctx.headers['if-modified-since'];
	const eTag = ctx.headers['if-none-match'];

	if (!lastModified && !eTag) {
		// 第一次请求
		return false;
	}

	if (lastModified && lastModified !== ctx.headers['last-modified']) {
		// 不一样 失效
		return false;
	}

	if (eTag && eTag !== ctx.headers.etag) {
		return false;
	}

	return true;
}
