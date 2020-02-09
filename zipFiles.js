const fs = require('fs');
var archiver = require('archiver');

var zlib = require('zlib');
var gzip = zlib.createGzip();
// windows
// var inp = fs.createReadStream('C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/db/node_project_dump');
// var out = fs.createWriteStream('C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/zip/node_project_dump.gz');

var inp = fs.createReadStream('/home/user/node.js-project/cron/node_project_dump');
var out = fs.createWriteStream('/home/user/node.js-project/zip/node_project_dump.gz');

gzipImageFolder();
gzipDump();

function gzipImageFolder() {
    // windows
    // const source = 'C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/public/img';
    // const out = 'C:/Users/Valeryia/Desktop/node.js_project/nginx/node.js-project/zip/img.zip';

    const source = '/home/user/node.js-project/public/img';
    const out = '/home/user/node.js-project/zip/img.zip';

    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

function gzipDump() {
    inp.pipe(gzip).pipe(out);
}