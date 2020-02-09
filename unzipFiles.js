const fs = require('fs');
const unzip = require('unzip-stream');

var zlib = require('zlib');
var ungzip = zlib.Unzip();
// windows
// var inp = fs.createReadStream('C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/zip/node_project_dump.gz');
// var out = fs.createWriteStream('C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/unzip/node_project_dump');

var inp = fs.createReadStream('/home/user/node.js-project/zip/node_project_dump.gz');
var out = fs.createWriteStream('/home/user/node.js-project/unzip/node_project_dump');

unzipFiles();

function unzipFiles() {
    // windows
    // const source = 'C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/zip/img.zip';
    // const out = 'C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/unzip/img';

    const source = '/home/user/node.js-project/zip/img.zip';
    const out = '/home/user/node.js-project/public/img';

    fs.createReadStream(source)
        .pipe(unzip.Extract({
            path: out
        }));
    inp.pipe(ungzip).pipe(out);
}