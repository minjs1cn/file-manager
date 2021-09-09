import { Context, Next } from 'koa';
import { token } from '../config';

export const auth = async (ctx: Context, next: Next) => {
	if (ctx.cookies.get('TOKEN') !== token) {
		ctx.redirect('/login');
	} else {
		await next();
	}
};
