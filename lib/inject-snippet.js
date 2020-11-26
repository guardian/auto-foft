const fs = require('fs');
const gzipSize = require('gzip-size');
const pgk = require('../package.json');

const readme = fs.readFileSync('./README.md', 'utf-8');
const snippet = fs.readFileSync('./dist/snippet.min.js', 'utf-8').trim();
const snippetSize = `${gzipSize.sync(snippet)} bytes (gzipped)`;

const example = `$1
    // ${pgk.name} snippet – ${snippetSize}
    ${snippet.slice(0, 40)} // ...etc
$3`;

fs.writeFileSync(
	'./README.md',
	readme
		.replace(/(<script>)(.|\n)*(<\/script>)/g, example)
		.replace(
			/(<pre style="white-space:break-spaces!important;">)(.|\n)*(<\/pre>)/g,
			`$1${snippet}$3`,
		)
		.replace(/(\d*) bytes \(gzipped\)/, snippetSize),
);
