const minify = require('minify');
const fs = require('fs');
const path = require('path');

minify('./dist/build.js')
	.then(minified => {
		console.log('Minfying...');
		fs.writeFileSync(path.join(__dirname, '../dist/build.js'), minified);
		console.log('Minified.');
	})
	.catch(console.error);