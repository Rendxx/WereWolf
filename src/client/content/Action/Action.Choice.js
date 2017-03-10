require('./Action.Choice.less');

var HTML = {
    wrap: '<div class="action_choice"></div>',
    title: '<div class="_title"><span></span></div>',
    inner: '<div class="_inner"></div>',
    content: '<div class="_content"></div>',
    number: '<div class="_number"></div>',
    name: '<div class="_name"></div>',
    line: '<div class="_line"></div>',
    btnYes: '<div class="_btn _yes _left">YES</div>',
    btnNo: '<div class="_btn _no _right">NO</div>',
    btnOk: '<div class="_btn _ok _mid">OK</div>',
};

var CSS = {
    show: '_show'
};

var Choice = function (){
    var that = this;
    var container = null;
    var playerIdx = -1;
    var _html = {
    };
    var _idx = -1;

    // callback ----------------------------------
    this.onYes = null;
    this.onNo = null;
    this.onOk = null;

    // public ------------------------------------
    this.setup = function (playerIdx_in, container_in, title){
        playerIdx = playerIdx_in;
        container = $(container_in);
        setupHtml(title);
    };

    this.update = function (idx, number, name, content, isCheck){
        _idx = idx;
        _html['content'].html(content);
        if (isCheck){
          _html['number'].html(number).show();
          _html['name'].html(name).show();
          _html['btnYes'].show();
          _html['btnNo'].show();
          _html['btnOk'].hide();
        }else{
          _html['number'].hide();
          _html['name'].hide();
          _html['btnYes'].hide();
          _html['btnNo'].hide();
          _html['btnOk'].show();
        }
    };

    this.show = function (){
        _html['wrap'].addClass(CSS.show);
    };

    this.hide = function (){
        _html['wrap'].removeClass(CSS.show);
    };

    // private -----------------------------------
    var setupHtml = function (title){
        _html['wrap']=$(HTML.wrap).appendTo(container);
        _html['_title']=$(HTML.title).appendTo(_html['wrap']).html(title);
        _html['inner']=$(HTML.inner).appendTo(_html['wrap']);

        _html['content']=$(HTML.content).appendTo(_html['inner']);
        _html['number']=$(HTML.number).appendTo(_html['inner']);
        _html['name']=$(HTML.name).appendTo(_html['inner']);
        _html['line']=$(HTML.line).appendTo(_html['inner']);
        _html['btnYes']=$(HTML.btnYes).appendTo(_html['inner']);
        _html['btnNo']=$(HTML.btnNo).appendTo(_html['inner']);
        _html['btnOk']=$(HTML.btnOk).appendTo(_html['inner']);

        _html['btnYes'].click(function(){
          that.onYes && that.onYes(_idx);
        });
        _html['btnNo'].click(function(){
          that.onNo && that.onNo();
        });
        _html['btnOk'].click(function(){
          that.onOk && that.onOk();
        });
    };
};

module.exports = Choice;
