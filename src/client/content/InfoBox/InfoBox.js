require('./InfoBox.alert.less');
require('./InfoBox.Phase.less');
require('./InfoBox.ActionResult.less');
require('./InfoBox.check.less');

var InfoBox = function (){
    this.alert = function (opts){
        var title = opts.title||'',
            content = opts.content||'',
            callback = opts.callback||null;

        var wrap = document.createElement("DIV");
        wrap.className = '_werewolf_alert';
        wrap.innerHTML = '<div class="_title">#title#</div><div class="_content">#content#</div><div class="_line"></div><div class="_ok">OK</div>'.replace(/#title#/g, title).replace(/#content#/g, content);

        var that =this;
        var btnOK = wrap.querySelector('._ok');
        btnOK.addEventListener("click", function(e){
            callback && callback(e);
            that.hide();
        }, false);

        $$.info({
          content: wrap,
          bg: "rgba(0, 0, 0, 0.9)"
        });
    };

    this.phase = function (opts){
        var title = opts.title||'',
            content = opts.content||'',
            className = opts.className||'',
            callback = opts.callback||null;

        var wrap = document.createElement("DIV");
        wrap.className = 'info_client_phase '+className+'';
        wrap.innerHTML =  [
            '<div class="_iconWrap">',
                '<div class="_icon"></div>',
                '<div class="_light"></div>',
            '</div>',
            '<div class="_word">',
                '<div class="_title">'+title+'</div>',
                '<div class="_content">'+content+'</div>',
                '<div class="_bracket_left">',
                    '<div class="_bracket_top"></div>',
                    '<div class="_bracket_mid"></div>',
                    '<div class="_bracket_btm"></div>',
                '</div>',
                '<div class="_bracket_right">',
                    '<div class="_bracket_top"></div>',
                    '<div class="_bracket_mid"></div>',
                    '<div class="_bracket_btm"></div>',
                '</div>',
                '<div class="_tapGuide">Tap to continue</div>',
            '</div>'
        ].join('');

        var that =this;
        wrap.addEventListener("click", function(e){
            callback && callback(e);
            that.hide();
        }, false);

        $$.info({
          content: wrap,
          bg: "rgba(0, 0, 0, 0.9)"
        });
    };

    this.actionResult = function (opts){
        var number = opts.number||'',
            name = opts.name||'',
            content = opts.content||'',
            className = opts.className||'',
            callback = opts.callback||null;

        var wrap = document.createElement("DIV");
        wrap.className = 'info_client_result '+className+'';
        wrap.innerHTML =  [
            '<div class="_word">',
                '<div class="_name">['+number+'] '+name+'</div>',
                '<div class="_content">'+content+'</div>',
                '<div class="_tapGuide">Tap to continue</div>',
            '</div>',
            '<div class="_bg"></div>'
        ].join('');

        var that =this;
        wrap.addEventListener("click", function(e){
            callback && callback(e);
            that.hide();
        }, false);

        $$.info({
          content: wrap,
          bg: "rgba(0, 0, 0, 0.9)"
        });
    };

    this.check = function (opts){
        var that =this;
        var title = opts.title||'',
            content = opts.content||'',
            callbackYes = opts.callbackYes||null,
            callbackNo = opts.callbackNo||null;

        var wrap = document.createElement("DIV");
        wrap.className = '_werewolf_check';
        wrap.innerHTML = '<div class="_title">#title#</div><div class="_content">#content#</div><div class="_line"></div><div class="_btn _yes _left">YES</div><div class="_btn _no _right">NO</div>'.replace(/#title#/g, title).replace(/#content#/g, content);

        var btnYES = wrap.querySelector('._yes');
        var btnNO = wrap.querySelector('._no');

        btnYES.addEventListener("click", function(e){
            callbackYes && callbackYes(e);
            that.hide();
        }, false);

        btnNO.addEventListener("click", function(e){
            callbackNo && callbackNo(e);
            that.hide();
        }, false);

        $$.info({
          content: wrap,
          bg: "rgba(0, 0, 0, 0.9)"
        });
    };

    this.hide = function (){
        $$.info.hide();
    };
};

module.exports = new InfoBox();
