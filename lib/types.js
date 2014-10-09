require('util-is');
var util = require('util');
var _    = require('underscore');
var adt  = require('adt');

/**
 * ADT (enum) reprsenting git object types.
 * @enum
 * @property Blob   - Blob
 * @property Tree   - Tree
 * @property Commit - Commit
 * @property Tag    - Tag
 *
 * @example
 * var blobType = Type.Blob;
*/
var Type = adt.data({
  Blob   : null,
  Tree   : null,
  Commit : null,
  Tag    : null
});

Type.fromString = function (str) {
  if (str instanceof Type) {
    return str;
  }
  switch (str.toLowerCase()) {
    case 'blob': return Type.Blob;
    case 'tree': return Type.Tree;
    case 'commit': return Type.Commit;
    case 'tag': return Type.Tag;
  }

  throw new Error('Invalid object type: ' + type);
};
exports.Type = Type;

/**
 * ADT reprsenting file modes.
 * @enum
 * @property New   - New
 * @property Directory   - Directory
 * @property SymbolicLink - Commit
 * @property GitLink     - GitLink
 * @property RegularFile(mode)  - RegularFile(mode)
 *
 * @example
 * var dir  = FileMode.Directory;
 * var file = FileMode.RegularFile(0644);
*/
var FileMode = adt.data({
  New : null,
  RegularFile : { mode : adt.only(Number)},
  Directory : null,
  SymbolicLink : null,
  GitLink : null
});

FileMode.fromString = function(str) {
  if (str instanceof FileMode) {
    return str;
  }
  /**
   * See for reference:
   *    https://github.com/gitster/git/blob/master/Documentation/technical/index-format.txt
   */
  switch (str) {
    case '000000': return FileMode.New;
    case '040000': return FileMode.Directory;
    case '120000': return FileMode.SymbolicLink;
    case '160000': return FileMode.GitLink;
  }
  if (/^100(644)|(755)$/.test(str)) {
    return FileMode.RegularFile(parseInt(str.substr(3), 8));
  }

  throw new Error('Unknown file mode: ' + str);
};
exports.FileMode = FileMode;

/**
 * Git reference.
 * @constructor
 * @arg {(Object|Ref)} obj
 * @property {String} name - Reference name
 * @property {Type}   type - Reference type
 * @property {String} sha  - Reference SHA1 hash
 */
function Ref(obj) {
  if (!this instanceof Ref) {
    return new Ref(obj);
  }
  this.name = obj.name;
  this.type = Type.fromString(obj.type);
  this.sha  = obj.sha;
}
exports.Ref = Ref;

/**
 * Git tree entry.
 * @constructor
 * @arg {(Object|TreeEntry)} obj
 * @property {String}    path - Entry path
 * @property {FileMode } mode - Entry filemode
 * @property {Type}      type - Entry type
 * @property {Number}    size - Size of entry * @property {String}    sha  - Entry SHA1 hash
 */
function TreeEntry(obj) {
  if (!this instanceof TreeEntry) {
    return new TreeEntry(obj);
  }
  this.path = obj.path;
  this.mode = FileMode.fromString(obj.mode);
  this.type = Type.fromString(obj.type);
  this.size = obj.size;
  this.sha  = obj.sha;
}
exports.TreeEntry = TreeEntry;

/**
 * Git tree.
 * @constructor
 * @arg {(Object|Tree)} obj
 * @property {TreeEntry[]} entries - Tree entries
 * @property {String}      sha     - Tree SHA1 hash
 */
function Tree(obj) {
  if (!this instanceof Tree) {
    return new Tree(obj);
  }
  this.entries = _.map(obj.entries, function (ent) {
                                      return new TreeEntry(ent);
                                    });
  this.sha     = obj.sha;
}
exports.Tree = Tree;

/**
 * Git blob.
 * @constructor
 * @arg {(Object|Blob)} obj
 * @property {String} sha     - Blob's SHA1 hash
 * @property {String} content - Content of blob
 * @property {Number} size    - Size of content
 */
function Blob(obj) {
  if (!this instanceof Blob) {
    return new Blob(obj);
  }
  this.sha      = obj.sha;
  this.content  = obj.content;
  this.size     = obj.size;
}
exports.Blob = Blob;

/**
 * Git author.
 * @constructor
 * @arg {(Object|Author)} obj
 * @property {String} name  - Author name
 * @property {String} email - Author email address
 * @property {Date}   date  - Date (of commit)
 */
function Author(obj) {
  if (!this instanceof Author) {
    return new Author(obj);
  }
  this.name  = obj.name;
  this.email = obj.email;
  this.date  = new Date(obj.date);
}
exports.Author = Author;

/**
 * Git commit.
 * @constructor
 * @arg {(Object|Commit)} obj
 * @property {Author}   author   - Author of commit
 * @property {Author}   commiter - Who checked in the commit
 * @property {String}   message  - Commit message
 * @property {String}   tree     - Tree SHA1 hash
 * @property {String[]} parents  - Parents SHA1 hashes
 * @property {String}   sha      - Commit SHA1 hash
 */
function Commit(obj) {
  if (!this instanceof Commit) {
    return new Commit(obj);
  }
  this.author    = new Author(obj.author);
  this.committer = new Author(obj.committer);
  this.message   = obj.message;
  this.tree      = obj.tree;
  this.parents   = obj.parents;
  this.sha       = obj.sha;
}
exports.Commit = Commit;

/**
 * Git tag.
 * @constructor
 * @arg {(Object|Commit)} obj
 * @property {String}   name     - Tag name
 * @property {Author}   tagger   - Author of tag
 * @property {String}   message  - Tag message
 * @property {Object}   tree     - Object (with `type` and `sha`) being tagged
 * @property {String}   sha      - Tag SHA1 hash
 */
function Tag(obj) {
  if (!this instanceof Tag) {
    return new Tag(obj);
  }
  this.name      = obj.name;
  this.tagger    = new Author(obj.tagger);
  this.message   = obj.message;
  this.object    = {type: Type.fromString(obj.object.type),
                    sha: obj.object.sha };
  this.sha       = obj.sha;
}
exports.Tag = Tag;
