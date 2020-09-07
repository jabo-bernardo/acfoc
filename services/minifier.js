const minify = require('minify');
const fs = require('fs');
const path = require('path');

minify('./dist/build.js')
	.then(minified => {
		fs.writeFileSync(path.join(__dirname, '../dist/build.js'), minified);
	})
	.catch(console.error);