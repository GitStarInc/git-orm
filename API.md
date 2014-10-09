#Index

**Classes**

* [class: Repo](#Repo)
  * [new Repo(user, repo)](#new_Repo)
  * [repo.getRefs([sub], cb)](#Repo#getRefs)
  * [repo.getBlob(sha, cb)](#Repo#getBlob)
  * [repo.getTree(sha, cb)](#Repo#getTree)
  * [repo.getCommit(sha, cb)](#Repo#getCommit)
  * [repo.getTag(sha, cb)](#Repo#getTag)
* [class: Ref](#Ref)
  * [new Ref(obj)](#new_Ref)
* [class: Blob](#Blob)
  * [new Blob(obj)](#new_Blob)
* [class: TreeEntry](#TreeEntry)
  * [new TreeEntry(obj)](#new_TreeEntry)
* [class: Tree](#Tree)
  * [new Tree(obj)](#new_Tree)
* [class: Author](#Author)
  * [new Author(obj)](#new_Author)
* [class: Commit](#Commit)
  * [new Commit(obj)](#new_Commit)
* [class: Tag](#Tag)
  * [new Tag(obj)](#new_Tag)

**Members**

* [enum: Type](#Type)
* [enum: FileMode](#FileMode)

**Typedefs**

* [callback: genCallback](#genCallback)

<a name="Repo"></a>
#class: Repo
**Members**

* [class: Repo](#Repo)
  * [new Repo(user, repo)](#new_Repo)
  * [repo.getRefs([sub], cb)](#Repo#getRefs)
  * [repo.getBlob(sha, cb)](#Repo#getBlob)
  * [repo.getTree(sha, cb)](#Repo#getTree)
  * [repo.getCommit(sha, cb)](#Repo#getCommit)
  * [repo.getTag(sha, cb)](#Repo#getTag)

<a name="new_Repo"></a>
##new Repo(user, repo)
**Params**

- user `String` - User name
- repo `String` - Repository name

<a name="Repo#getRefs"></a>
##repo.getRefs([sub], cb)
**Params**

- \[sub\] `String` - Reference sub-namespace (if any)
- cb <code>[genCallback](#genCallback)</code> - Callback

<a name="Repo#getBlob"></a>
##repo.getBlob(sha, cb)
**Params**

- sha `String` - SHA1 of blob to lookup
- cb <code>[genCallback](#genCallback)</code> - Callback

<a name="Repo#getTree"></a>
##repo.getTree(sha, cb)
**Params**

- sha `String` - SHA1 of tree to lookup
- cb <code>[genCallback](#genCallback)</code> - Callback

<a name="Repo#getCommit"></a>
##repo.getCommit(sha, cb)
**Params**

- sha `String` - SHA1 of commit to lookup
- cb <code>[genCallback](#genCallback)</code> - Callback

<a name="Repo#getTag"></a>
##repo.getTag(sha, cb)
**Params**

- sha `String` - SHA1 of tag to lookup
- cb <code>[genCallback](#genCallback)</code> - Callback

<a name="Ref"></a>
#class: Ref
**Members**

* [class: Ref](#Ref)
  * [new Ref(obj)](#new_Ref)

<a name="new_Ref"></a>
##new Ref(obj)
Git reference.

**Params**

- obj `Object` | <code>[Ref](#Ref)</code>

**Properties**

- name `String` - Reference name
- type <code>[Type](#Type)</code> - Reference type
- sha `String` - Reference SHA1 hash

<a name="Blob"></a>
###class: Blob
**Members**

* [class: Blob](#Blob)
  * [new Blob(obj)](#new_Blob)

<a name="new_Blob"></a>
####new Blob(obj)
Git blob.

**Params**

- obj `Object` | <code>[Blob](#Blob)</code>  

**Properties**

- size `Number` - Size of the returned content
- content `String` - Contents of the blob
- sha `String` - Reference SHA1 hash

<a name="TreeEntry"></a>
#class: TreeEntry
**Members**

* [class: TreeEntry](#TreeEntry)
  * [new TreeEntry(obj)](#new_TreeEntry)

<a name="new_TreeEntry"></a>
##new TreeEntry(obj)
Git tree entry.

**Params**

- obj `Object` | <code>[TreeEntry](#TreeEntry)</code>

**Properties**

- path `String` - Entry path
- mode <code>[FileMode](#FileMode)</code> - Entry filemode
- type <code>[Type](#Type)</code> - Entry type
- size `Number` - Size of entry * @property {String}    sha  - Entry SHA1 hash

<a name="Tree"></a>
#class: Tree
**Members**

* [class: Tree](#Tree)
  * [new Tree(obj)](#new_Tree)

<a name="new_Tree"></a>
##new Tree(obj)
Git tree.

**Params**

- obj `Object` | <code>[Tree](#Tree)</code>

**Properties**

- entries <code>[Array.&lt;TreeEntry&gt;](#TreeEntry)</code> - Tree entries
- sha `String` - Tree SHA1 hash

<a name="Author"></a>
#class: Author
**Members**

* [class: Author](#Author)
  * [new Author(obj)](#new_Author)

<a name="new_Author"></a>
##new Author(obj)
Git author.

**Params**

- obj `Object` | <code>[Author](#Author)</code>

**Properties**

- name `String` - Author name
- email `String` - Author email address
- date `Date` - Date (of commit)

<a name="Commit"></a>
#class: Commit
**Members**

* [class: Commit](#Commit)
  * [new Commit(obj)](#new_Commit)

<a name="new_Commit"></a>
##new Commit(obj)
Git commit.

**Params**

- obj `Object` | <code>[Commit](#Commit)</code>

**Properties**

- author <code>[Author](#Author)</code> - Author of commit
- commiter <code>[Author](#Author)</code> - Who checked in the commit
- message `String` - Commit message
- tree `String` - Tree SHA1 hash
- parents `Array.<String>` - Parents SHA1 hashes
- sha `String` - Commit SHA1 hash

<a name="Tag"></a>
#class: Tag
**Members**

* [class: Tag](#Tag)
  * [new Tag(obj)](#new_Tag)

<a name="new_Tag"></a>
##new Tag(obj)
Git tag.

**Params**

- obj `Object` | <code>[Commit](#Commit)</code>

**Properties**

- name `String` - Tag name
- tagger <code>[Author](#Author)</code> - Author of tag
- message `String` - Tag message
- tree `Object` - Object (with `type` and `sha`) being tagged
- sha `String` - Tag SHA1 hash

<a name="Type"></a>
#enum: Type
ADT (enum) reprsenting git object types.

**Properties**: `Blob`, `Tree`, `Commit`, `Tag`
**Example**
var blobType = Type.Blob;

<a name="FileMode"></a>
#enum: FileMode
ADT reprsenting file modes.

**Properties**: `New`, `Directory`, `SymbolicLink`, `GitLink`, `RegularFile(mode)`
**Example**
var dir  = FileMode.Directory;
var file = FileMode.RegularFile(0644);

<a name="genCallback"></a>
#callback: genCallback
Callbacks, with result type corresponding to the named function

**Params**

- err `Error`
- res <code>[Ref](#Ref)</code> | <code>[Array.&lt;Ref&gt;](#Ref)</code> | `Blob` | <code>[Tree](#Tree)</code> | <code>[Commit](#Commit)</code> | <code>[Tag](#Tag)</code>

**Type**: `function`
