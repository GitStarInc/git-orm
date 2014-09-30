/*jslint node: true */
'use strict';

var request = require('request'),
    util = require('util'),
    validator = require('validator'),
    repoPrefix = '/repos/:repo/git/';

module.exports = GitOrm;

util.isString = function (input) {
    return input && typeof input === 'string';
};

util.isObject = function (input) {
    return input && typeof input === 'object';
};

util.isFunction = function (input) {
    return input && typeof input === 'function';
};

//
// options: configuration for accessing the git backend
// - url: URL to access the repository, e.g. https://api.github.com
// - repo: The repository on the backend we want to access
// - repoPrefix: The path template for accessing the repository.
//      This must contain ':repo' which will be replaced by the repository
//      during access. (e.g. /repos/:repo/git/)
// - cb: (optional) A callback function that is called when data is returned
//      by any of the getter functions (default will just print result to screen)
//
function GitOrm(options) {
    if (!(this instanceof GitOrm)) {
        return new GitOrm(options);
    }

    this.data = [];

    function getData(url, cb) {
        request(
            {
                url: url,
                headers: { 'User-Agent': 'Gitstar-HTTP' }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    try {
                        var jsonData = JSON.parse(body);
                        if (cb) {
                            cb(jsonData);
                        } else if (options.cb) {
                            options.cb(jsonData);
                        }
                        this.data = jsonData;
                    } catch (e) {
                        throw new Error('Bad data recieved');
                    }
                } else {
                    throw new Error(
                        'Could not retrieve repo: ' + response.statusCode + '\n' +
                        'URL: ' + url);
                }
            });
    }

    function getUrl(repo, suffix) {
        return options.url + repoPrefix.replace(':repo', repo) + suffix;
    }

    function isValidSha(sha) {
        return util.isString(sha) && /^[A-Fa-f0-9]{40}$/.test(sha);
    }

    function checkSha(sha) {
        if (!isValidSha(sha)) {
            throw new Error('Invalid sha specified: ' + sha);
        }
        return sha;
    }

    // Validate all of the incoming options
    if (!options || !util.isObject(options)) {
        throw new Error('Options argument not specified or invalid');
    }

    if (options.repoPrefix) {
        if (options.repoPrefix.indexOf(':repo') === -1) {
            throw new Error('Repo prefix option must contain ":repo" string');
        }
        repoPrefix = options.repoPrefix;
    }

    if (!options.url || !validator.isURL(options.url)) {
        throw new Error('URL invalid or unspecified');
    }

    if (options.url.indexOf('/') === options.url.length - 1) {
        options.url = options.url.substr(0, options.url.length - 1);
    }

    if (!options.cb) {
        options.cb = function (data) {
            console.log(data);
        };
    }

    if (!options.repo) {
        throw new Error('No repository specified');
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
}
