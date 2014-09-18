"use strict";

var Gitstar = require('./index');

var repo = new Gitstar(
        {
            url: "https://api.github.com",
            repo: "node",
            repoPrefix: '/repos/joyent/:repo/git/',
            cb: function (data) { console.log(data); }
        });

repo.getRefs(function(data) {
    console.log(data);
    var json = JSON.parse(data);
    for (var i=0; i < json.length; i++) {
        if (json[i].object) {
            switch(json[i].object.type) {
            case 'commit':
                repo.getCommit(json[i].object.sha);
                break;
            case 'blob':
                repo.getBlob(json[i].object.sha);
                break;
            case 'tag':
                repo.getTag(json[i].object.sha);
                break;
            case 'tree':
                repo.getTree(json[i].object.sha);
                break;
            default:
                break;
            }
        }
    }
});
