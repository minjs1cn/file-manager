import { Context, Next } from 'koa';
import { config, loginTemplate, token } from '../config';

export const login = async (ctx: Context, next: Next) => {
	if (ctx.path === '/login') {
		if (ctx.method === 'GET') {
			ctx.body = loginTemplate({
				title: '登录',
				data: {},
			});
		} else {
			const { username, password } = ctx.request.body;

			if (username === config.username && password === config.password) {
				ctx.cookies.set('TOKEN', token);
				ctx.body = 'ok';
			} else {
				ctx.body = 'no';
			}
		}
	} else {
		await next();
	}
};
