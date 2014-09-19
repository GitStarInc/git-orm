"use strict";

var GitOrm = require('./index');

var repo = new GitOrm(
        {
            url: "https://api.github.com",
            repo: "node",
            repoPrefix: '/repos/joyent/:repo/git/',
            cb: function (data) { console.log(data); }
        });

repo.getRefs(function(data) {
    console.log(data);
    for (var i=0; i < data.length; i++) {
        if (data[i].object) {
            switch(data[i].object.type) {
            case 'commit':
                repo.getCommit(data[i].object.sha);
                break;
            case 'blob':
                repo.getBlob(data[i].object.sha);
                break;
            case 'tag':
                repo.getTag(data[i].object.sha);
                break;
            case 'tree':
                repo.getTree(data[i].object.sha);
                break;
            default:
                break;
            }
        }
    }
});
