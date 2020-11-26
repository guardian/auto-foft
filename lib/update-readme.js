const fs = require('fs');
const gzipSize = require('gzip-size');
const pgk = require('../package.json');

const readme = fs.readFileSync('./README.md', 'utf-8');
const snippet = fs.readFileSync('./dist/snippet.min.js', 'utf-8').trim();
const snippetSize = `${gzipSize.sync(snippet)} bytes (gzipped)`;

const example = `$1
    // ${pgk.name} snippet – ${snippetSize}
    ${snippet}
$3`;

fs.writeFileSync(
	'./README.md',
	readme
		.replace(/^# .*/g, `# ${pgk.name}`)
		.replace(/(<script>)(.|\n)*?(<\/script>)/, example)
		.replace(/(\d*) bytes \(gzipped\)/g, snippetSize),
);
