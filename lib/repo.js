require('util-is');
var util      = require('util');
var _         = require('underscore');
var validator = require('validator');
var types     = require('./types');

module.exports = function(driver) {
  return function(user, repo) {
    return new Repo(driver, user, repo);
  };
};

/**
 * Callbacks, with result type corresponding to the named function
 * @callback genCallback
 * @param {Error} err
 * @param {Ref|Ref[]|Blob|Tree|Commit|Tag} res
 */


/**
 * @constructor
 * @arg {String} user - User name
 * @arg {String} repo - Repository name
 */
function Repo(driver, user, repo) {
  if (!this instanceof Repo) {
    return new Repo(driver, user, repo);
  }

  this.driver = driver;

  if (!user || !util.isString(user) || isEmptyOrDots(user)) {
    throw new TypeError('Expected valid string user argument');
  }
  this.user = user;

  if (!repo || !util.isString(repo) || isEmptyOrDots(repo)) {
    throw new TypeError('Expected valid string repo argument');
  }
  this.repo = repo;

  this.prefix = ['repos', this.user, this.repo, 'git'].join('/');
}

Repo.prototype.get = function(suffix, cb) {
  if (!util.isFunction(cb)) {
    throw new Error('Expected callback function');
  }
  var path = this.prefix + '/' + suffix;
  this.driver.get(path, cb);
};

/**
 * @method
 * @param {String} [sub] - Reference sub-namespace (if any)
 * @param {genCallback} cb - Callback
 */
Repo.prototype.getRefs = function(sub, cb) {
  if (util.isFunction(sub)) { // Called without suffix:
    cb  = sub;
    sub = '';
  }
  var path = _.filter(sub.split('/'), isNotEmptyOrDots).join('/');
  return this.get('refs/' + path, function (err, res) {
    if (err) {
      cb(err, res);
    } else {
      var toRef = function (json) {
        try {
          return new types.Ref({name: json.ref,
                                type: json.object.type,
                                sha:  json.object.sha });
        } catch (e) {
          err = new Error('Invalid JSON response, ' + e);
          return undefined;
        }
      };

      if (util.isArray(res)) {
        var refs = _.map(res, toRef);
        cb(err, refs);
      } else {
        var ref = toRef(res);
        cb(err,  ref);
      }
    }
  });
};

/**
 * @method
 * @param {String} sha     - SHA1 of blob to lookup
 * @param {genCallback} cb - Callback
 */
Repo.prototype.getBlob = function(sha, cb) {
  if (!isSHA(sha)) {
    throw new Error('Expected object SHA1 hash');
  }

  return this.get('blobs/' + sha, function (err, res) {
    if (err) {
      cb(err, res);
    } else {
      try {
        res = new types.Blob({content: res.content,
                              size: res.size,
                              sha: res.sha });
      } catch (e) {
        err = new Error('Invalid JSON response, ' + e);
      }
      cb(err, res);
    }
  });
};

/**
 * @method
 * @param {String} sha - SHA1 of tree to lookup
 * @param {genCallback} cb - Callback
 */
Repo.prototype.getTree = function(sha, cb) {
  if (!isSHA(sha)) {
    throw new Error('Expected object SHA1 hash');
  }

  return this.get('trees/' + sha, function (err, res) {
    if (err) {
      cb(err, res);
    } else {
      try {
        res = new types.Tree({entries: res.tree,
                              sha: res.sha });
      } catch (e) {
        err = new Error('Invalid JSON response, ' + e);
      }
      cb(err, res);
    }
  });
};

/**
 * @method
 * @param {String} sha - SHA1 of commit to lookup
 * @param {genCallback} cb - Callback
 */
Repo.prototype.getCommit = function(sha, cb) {
  if (!isSHA(sha)) {
    throw new Error('Expected object SHA1 hash');
  }

  return this.get('commits/' + sha, function (err, res) {
    if (err) {
      cb(err, res);
    } else {
      try {
        var parents = _.map(res.parents, function(ent) {
          return ent.sha;
        });
        res = new types.Commit({author: res.author,
                                committer: res.committer,
                                message: res.message,
                                tree: res.tree.sha,
                                parents: parents,
                                sha: res.sha });
      } catch (e) {
        err = new Error('Invalid JSON response, ' + e);
      }
      cb(err, res);
    }
  });
};

/**
 * @method
 * @param {String} sha - SHA1 of tag to lookup
 * @param {genCallback} cb - Callback
 */
Repo.prototype.getTag = function(sha, cb) {
  if (!isSHA(sha)) {
    throw new Error('Expected object SHA1 hash');
  }

  return this.get('tags/' + sha, function (err, res) {
    if (err) {
      cb(err, res);
    } else {
      try {
        var parents = _.map(res.parents, function(ent) {
          return ent.sha;
        });
        res = new types.Tag({tagger: res.tagger,
                             name: res.tag,
                             message: res.message,
                             object: res.object,
                             sha: res.sha });
      } catch (e) {
        err = new Error('Invalid JSON response, ' + e);
      }
      cb(err, res);
    }
  });
};

// Helpers

function isSHA(sha) {
  return validator.isHexadecimal(sha) && (sha.length == 40);
}

function isEmptyOrDots(dir) {
  return (dir === '') || (dir === '..') || (dir === '.');
}
function isNotEmptyOrDots(dir) {
  return !isEmptyOrDots(dir);
}
