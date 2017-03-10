
﻿var Style = require('./ScrollOption.less');

var HTML = {
    wrap: '<div class="_scrollOption"></div>',
    optionWrap: '<div class="_optionWrap"></div>',
    optionList: '<div class="_optionList"></div>',
    option: '<div class="_option"></div>'
};

var CSS = {
  first: '_first',
  last: '_last',
  animation: '_animation',
  actived: '_actived'
};

var PARA = {
  width:100
};

var ScrollOption = function (container, optionData, para_in){
  'use strict';
  var that = this;
  var html = {
    container: $(container),
    wrap: null,
    optionList: null,
    option: [],
  };
  var para = {
      width: (para_in&&para_in.width)||PARA.width
  };
  var scrollRange = [0,100];
  var currentX = 0;
  var _lastActive = -1;

  // public ---------------------------------------------------------
  this.getSelect = function (){
      var idx = ~~(currentX/para.width);
      return optionData[idx].key;
  };

  // private --------------------------------------------------------
  var checkSelect = function (){
      var idx = ~~(currentX/para.width);
      currentX = (idx+0.5)*para.width;
      render();
  };

  var render = function (){
      html['optionList'].css('transform', 'translateX(-'+currentX+'px)')
  };

  var setAniamtion = function (isOn){
      if (isOn) html['optionList'].addClass(CSS.animation);
      else  html['optionList'].removeClass(CSS.animation);
      html['optionList'][0].offsetHeight;
  };

  var updateActive = function (){
      var t = ~~(currentX/para.width);
      if (_lastActive === t) return;
      if (_lastActive!==-1)html['option'][_lastActive].removeClass(CSS.actived);
      _lastActive = t;
      html['option'][_lastActive].addClass(CSS.actived);
  };

  // setup ----------------------------------------------------------
  var _setupHtml = function (){
      html['wrap']= $(HTML.wrap).appendTo(html['container']);
      html['optionWrap'] = $(HTML.optionWrap).appendTo(html['wrap']);
      html['optionList'] = $(HTML.optionList).appendTo(html['optionWrap']);
      html['option']=[];
      for (var i=0; i<optionData.length; i++) {
        _addOpt(i, optionData[i].key, optionData[i].content);
      }
      html['option'][0].addClass(CSS.first);
      html['option'][html['option'].length-1].addClass(CSS.last);
      scrollRange = [0, optionData.length*para.width-1];
  };

  var _addOpt = function (idx, key, content){
      var ele = $(HTML.option).appendTo(html['optionList']);
      ele.width(para.width);
      ele.html(content);
      ele.css('left',idx*para.width+'px')
      html['option'].push(ele);
  };

  var _setupEvent = function (){
      var lastX = 0;
      var getMousePos = function (e) {
          if (e.pageX == undefined) {
              return [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
          } else {
              return [e.pageX, e.pageY];
          }
      };

      var startDrag = function (e){
        e.preventDefault();
        lastX=getMousePos(e)[0];
        setAniamtion(false);
      };

      var onMove = function (e){
        e.preventDefault();
        var x = getMousePos(e)[0];
        currentX = Math.max(scrollRange[0],Math.min(scrollRange[1],currentX-x+lastX));
        lastX=x;
        render();
        updateActive();
      };

      var stopDrag = function (e){
        e.preventDefault();
        setAniamtion(true);
        checkSelect();
      };

      html['container'][0].addEventListener('mousedown', startDrag, false);
      html['container'][0].addEventListener('touchstart', startDrag, false);
      html['container'][0].addEventListener('mousemove', onMove, false);
      html['container'][0].addEventListener('touchmove', onMove, false);
      html['container'][0].addEventListener('mouseup', stopDrag, false);
      html['container'][0].addEventListener('touchend', stopDrag, false);
      html['container'][0].addEventListener('mouseout', stopDrag, false);
      document.addEventListener('mouseout',  function(e) {
          e = e ? e : window.event;
          var from = e.relatedTarget || e.toElement;
          if (!from || from.nodeName == "HTML") {
              stopDrag(e);
          }
      }, false);
  };

  var _init = function (){
      _setupHtml();
      _setupEvent();
      checkSelect();
      updateActive();
  };
  _init();
};

module.exports = ScrollOption;
