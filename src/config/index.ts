import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const port = 3001;
export const compressed = /\.(css|js|html)/;
export const cache = {
	maxAge: 600,
	expires: true,
	cacheControl: true,
	lastModified: true,
	eTag: true,
};
export const ROOT = path.join(__dirname, '../../../');

export const template = Handlebars.compile(
	fs
		.readFileSync(path.join(__dirname, '../../public/layout/dir.html'))
		.toString(),
);
