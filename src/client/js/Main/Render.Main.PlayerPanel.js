var ROLEDATA = require('GLOBAL/js/RoleData.js');
var InfoBox = require('CLIENT/js/InfoBox.js');

require('CLIENT/less/Main/Main.PlayerPanel.less');

var HTML = {
    title: '<div class="_title"><span>Player List</span></div>',
    inner: '<div class="_inner"></div>',
    hide: '<div class="_hide"></div>',
    space: '<div class="_space"></div>',

    player: {
      wrap: '<div class="_player"></div>',
      number: '<div class="_number"></div>',
      name: '<div class="_name"></div>',
      vote: '<div class="_vote"></div>',
      voteMarker: '<div class="_voteMarker"></div>',
    },
};

var CSS = {
};

var PlayerPanel = function(container) {
    "use strick";
    // Property -------------------------------------
    var that = this;
    var html = {
        container : $(container)
    };
    var actionCode = null;
    var playerNum = 0;

    // Callback ------------------------------
    this.onHide = null;
    this.onSelect = null;

    // Public --------------------------------
    this.show = function() {
        html['container'].fadeIn(200);
    };

    this.hide = function() {
        html['container'].fadeOut(200);
    };

    this.reset = function(playerInfo) {
        playerNum = playerInfo.length;
        setupHtml(playerInfo);
        setupVoteCache(playerInfo);
    };

    this.startAction = function(code) {
        actionCode = code;
        this.show();
    };

    this.stopAction = function() {
        actionCode = null;
        this.hide();
    };

    this.setNote = function(noteArr) {
        for (var i=0;i<playerNum;i++){
            setVote(i,noteArr[i]);
        }
    };

    this.clearMarker = function() {
        for (var i=0;i<playerNum;i++){
            setVote(i);
        }
    };

    // Private ---------------------------------------
    var setVote = function (idx, vote){
        var pkg = html['player'][idx];
        pkg.vote.empty();
        if (vote===0) return;
        var i = 0;
        var t = 1;
        while (i<playerNum){
            if ((vote&t)>0){
                pkg.vote.append(html['voteCache'][i]);
            }
            i++;
            t=t<<1;
        }
    };

    var selectPlayer = function (idx){
        if (actionCode===null) return;
        that.onSelect && that.onSelect(idx);
    };

    var setupVoteCache = function (playerInfo){
        html['voteCache'] = [];
        for (var i=0;i<playerInfo.length;i++){
            html['voteCache'].push($(HTML.player.voteMarker).text(playerInfo[i].number));
        }
    };

    var setupHtml = function(playerInfo) {
        html['container'].empty();
        html['title'] = $(HTML.title).appendTo(html['container']);
        html['inner'] = $(HTML.inner).appendTo(html['container']);
        html['sapce'] = $(HTML.space).appendTo(html['inner']);
        html['hide'] = $(HTML.hide).appendTo(html['title']);
        html['hide'].click(function() {
          that.hide();
          that.onHide && that.onHide();
        });

        html['player'] = [];
        for (var i=0;i<playerNum;i++){
            addPlayer(i, playerInfo[i][0],playerInfo[i][1]);
        }
        html['sapce2'] = $(HTML.space).appendTo(html['inner']);
    };

    var addPlayer = function (idx, number, name){
        var pkg = {};
        pkg['wrap'] = $(HTML.player.wrap).appendTo(html['inner']);
        pkg['number'] = $(HTML.player.number).appendTo(pkg['wrap']).text(number);
        pkg['name'] = $(HTML.player.name).appendTo(pkg['wrap']).text(name);
        pkg['vote'] = $(HTML.player.vote).appendTo(pkg['wrap']);
        html['player'][idx] = pkg;
        pkg['wrap'].click(function(e){ selectPlayer(idx); });
        return pkg;
    };

    var _init = function() {
    }();
};

module.exports = PlayerPanel;











// var CountDown = function (){
//     var that = this;
//     var ref = null;
//
//     this.start = function (time, callback){
//         if (ref!==null) clearTimeout(ref);
//         ref = setTimeout(time, function(){
//           ref = null;
//           callback && callback();
//         });
//     };
//
//     this.stop = function (){
//         if (ref!==null) clearTimeout(ref);
//     };
//
//     this.dispose = function (){
//         ref = null;
//     }
// };
//
// var cd = new CountDown();
// cs.start(10000, function(){ /* do things... */});
