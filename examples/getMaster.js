var driver = require('git-orm-nodegit-http')('https://api.github.com/');
var git  = require('../');
var Repo = git.Repo(driver);

var repo = new Repo('GitStarInc', 'git-orm');

repo.getRefs('heads/master', function (err, ref) {
  if (err) {
    throw err;
  }
  console.log('%s %s %s', ref.sha.substr(0, 8), ref.name, ref.type);
});
