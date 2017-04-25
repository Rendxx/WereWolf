'use strict';
require('./Info.less');

Info = {
    DAY: [
      '<div class="info_client info_day">',
        '<div class="_icon"></div>',
        '<div class="_text">It\'s a new day.<br/>Share your idea and vote.</div>',
      '</div>'
    ].join(''),
    DAED: [
      '<div class="info_client info_dead">',
        '<div class="_icon"></div>',
        '<div class="_text">You are dead.<br/>Rest in peace.</div>',
      '</div>'
    ].join(''),
};

module.exports = Info;
