'use strict';

var request = require('request'),
    validator = require('validator'),
    repoPrefix = '/repos/:repo/git/';

module.exports = function (options) {
    // Validate all of the incoming options
    if (!options || typeof options !== 'object') {
        throw new Error('Options argument not specified or invalid');
    }

    if (options.repoPrefix) {
        if (options.repoPrefix.indexOf(':repo') === -1) {
            throw new Error("Repo prefix option must contain ':repo' string");
        }
        repoPrefix = options.repoPrefix;
    }

    if (!options.url || !validator.isURL(options.url)) {
        throw new Error('URL invalid or unspecified');
    }

    if (options.url.indexOf('/') === options.url.length-1) {
        options.url = options.url.substr(0, options.url.length-1);
    }

    if (!options.cb) {
        options.cb = function (data) {
            console.log(data);
        };
    }

    if (!options.repo) {
        throw new Error('No repository specified');
    }

    this.data = [];
    this.options = options;

    function getUrl(repo, suffix) {
        return options.url + repoPrefix.replace(':repo', repo) + suffix;
    }

    function getData(url, cb) {
        request(
            {
                url: url,
                headers: { 'User-Agent': 'Gitstar-HTTP' }
            },
            function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (cb) {
                    cb(body);
                } else if (options.cb) {
                    options.cb(body);
                }
                this.data = body;
            } else {
                throw new Error(
                    'Could not retrieve repo: ' + response.statusCode + '\n' +
                    'URL: ' + url);
            }
        });
    }

    function isValidSha(sha) {
        return typeof sha === 'string' && /^[A-Fa-f0-9]{40}$/.test(sha);
    }

    function checkSha(sha) {
        if (!isValidSha(sha)) {
            throw new Error('Invalid sha specified: ' + sha);
        }
        return sha;
    }

    this.getRefs = function (cb) {
        getData(getUrl(options.repo, 'refs'), cb);
    };

    this.getBlob = function (sha, cb) {
        getData(getUrl(options.repo, 'blobs/' + checkSha(sha)), cb);
    };

    this.getTags = function (cb) {
        getData(getUrl(options.repo, 'tags'), cb);
    };

    this.getTag = function (sha, cb) {
        getData(getUrl(options.repo, 'tags/' + checkSha(sha)), cb);
    };

    this.getCommit = function (sha, cb) {
        getData(getUrl(options.repo, 'commits/' + checkSha(sha)), cb);
    };

    this.getTree = function (sha, cb) {
        getData(getUrl(options.repo, 'trees/' + checkSha(sha)), cb);
    };

    // TODO: Not yet implemented on http api, not sure
    this.getBranches = function (cb) {
    };

    this.getDiffs = function (sha, cb) {
    };

    this.getStats = function (sha, cb) {
    };

    this.getBlame = function (sha, file, cb) {
    };

    return this;
};
