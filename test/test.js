var _ = require('underscore');
var should = require('should');
var driver = require('git-orm-nodegit-http')('https://api.github.com/');
var git  = require('../index');
var Repo = git.Repo(driver);

var Ref       = git.Ref;
var Blob      = git.Blob;
var Tree      = git.Tree;
var TreeEntry = git.TreeEntry;
var Author    = git.Author;
var Commit    = git.Commit;
var Tag       = git.Tag;

var util = require('util');

var testRefs = [ new Ref({name:'refs/heads/master',
                          type: git.Type.Commit,
                          sha:'6a0b75bdd2a7e8f08670af9295be4f149344eec0'})
               ,  new Ref({name:'refs/heads/mybranch',
                          type: git.Type.Commit,
                          sha:'249a81e10c5cbc482557870a61edeec5b1d1a4cb'})
               , new Ref({name:'refs/tags/v0.0',
                          type: git.Type.Tag,
                          sha:'3e0a08f77cf3d1d3cc8dacf62022ae22801fa366'}) ];

var repo   = new Repo('GitStarInc', 'git-orm-testrepo');

describe('getRefs()', function (done) {
  it('respond with Refs', function (done) {
    repo.getRefs(function(err, refs) {
      if (err) { throw err; }
      _.map(refs, function(ref) {
        should(ref).be.an.instanceof(Ref);
      });
      JSON.stringify(refs).should.equal(JSON.stringify(testRefs));
      done(err, refs);
    });
  });
});

describe('getRefs(tags)', function (done) {
  it('respond with Refs', function (done) {
    repo.getRefs('tags', function(err, refs) {
      if (err) { throw err; }
      _.map(refs, function(ref) {
        should(ref).be.an.instanceof(Ref);
      });
      JSON.stringify(refs[0]).should.equal(JSON.stringify(testRefs[2]));
      done(err, refs);
    });
  });
});

describe('getRefs(heads/master)', function (done) {
  it('respond with Ref', function (done) {
    repo.getRefs('heads/master', function(err, ref) {
      if (err) { throw err; }
      should(ref).be.an.instanceof(Ref);
      JSON.stringify(ref).should.equal(JSON.stringify(testRefs[0]));
      done(err, ref);
    });
  });
});

describe('getTree(...)', function (done) {
  it('respond with Tree', function (done) {
    var ent = new TreeEntry({path:'file',
                             mode: git.FileMode.RegularFile(0644),
                             type:'blob',
                             sha:'81b3b24d2d2e3eba3c0bbf86de70a7b90b08cd46',
                             size:5 });
    var dir = new Tree({sha:'7e17bec02d663905c953f652b74421f0fc523a20',
                        entries:[ent]});
    repo.getTree(dir.sha, function(err, tree) {
      if (err) { throw err; }
      should(tree).be.an.instanceof(Tree);
      _.map(tree.entries, function(ent) {
        should(ent).be.an.instanceof(TreeEntry);
      });
      JSON.stringify(tree).should.equal(JSON.stringify(dir));
      done(err, tree);
    });
  });
});

describe('getBlob(...)', function (done) {
  it('respond with Blob', function (done) {
    var file = new Blob({sha:'81b3b24d2d2e3eba3c0bbf86de70a7b90b08cd46',
                         size:5,
                         content: 'dzAwdAo=\n'});
    repo.getBlob(file.sha, function(err, blob) {
      if (err) { throw err; }
      should(blob).be.an.instanceof(Blob);
      JSON.stringify(blob).should.equal(JSON.stringify(file));
      done(err, blob);
    });
  });
});

describe('getCommit(...)', function (done) {
  it('respond with Commit', function (done) {
    var deian = new Author({date: new Date('2014-09-21T05:48:54.000Z'),
                            name:'Deian Stefan',
                            email:'deian@cs.stanford.edu'});
    var mybranch = new Commit({sha:'81f2b7a7ada4b5d7f6ca2c9b5a1a091c39be1404',
                               author: deian,
                               committer: deian,
                               message:'updated file',
                               tree: '2c4434ff2854c5928220ba7108175f3ccd1c1cd9',
                               parents:['9e73a2ab0df54e664edd5f554449399126aac3bd']});
    repo.getCommit(mybranch.sha, function(err, commit) {
      if (err) { throw err; }
      should(commit).be.an.instanceof(Commit);
      should(commit.author).be.an.instanceof(Author);
      should(commit.committer).be.an.instanceof(Author);
      JSON.stringify(commit).should.equal(JSON.stringify(mybranch));
      done(err, commit);
    });
  });
});

describe('getTag(...)', function (done) {
  it('respond with Tag', function (done) {
    var deian = new Author({date: new Date('2014-09-21T05:49:22.000Z'),
                            name:'Deian Stefan',
                            email:'deian@cs.stanford.edu'});
    var mytag = new Tag({sha:'3e0a08f77cf3d1d3cc8dacf62022ae22801fa366',
                         name: 'v0.0',
                         tagger: deian,
                         message:'release world\n',
                         object: {type: git.Type.Commit,
                                  sha:'81f2b7a7ada4b5d7f6ca2c9b5a1a091c39be1404'}
                         });
    repo.getTag(mytag.sha, function(err, tag) {
      if (err) { throw err; }
      should(tag).be.an.instanceof(Tag);
      should(tag.tagger).be.an.instanceof(Author);
      JSON.stringify(tag).should.equal(JSON.stringify(mytag));
      done(err, tag);
    });
  });
});
