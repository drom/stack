#!/usr/bin/env node

'use strict';

var pkg = require('../package.json'),
    fs = require('fs'),
    path = require('path'),
    cli = require('commander');

function list(val) {
    return val.split(',');
}

function extract (src) {
    var ret, lines, state;
    lines = src.split('\n');
    state = 0;
    ret = [];
    lines.forEach(function (line) {
        var tag = (line.slice(0, 3) === '```');
        if (state === 0) {
            if (tag) {
                state = 1;
            }
        } else {
            if (tag) {
                state = 0;
                ret.push('');
            } else {
                ret.push(line);
            }
        }
    });
    return ret.join('\n');
}

cli
    .version(pkg.version)
    .usage('[options]')
    .option('-i, --input <file>', 'source markdown file', list)
    .parse(process.argv);

if (!cli.input) { console.log('Error: input file is required'); }

if (!cli.input) {
    cli.help();
}

fs.readFile(
    path.resolve(process.cwd(), cli.input[0]),
    {encoding: 'utf8'},
    function (err, src) {
        if (err) { throw err; }
        console.log(extract(src));
    }
);
