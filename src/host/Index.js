/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/

var Style = require('./less/Index.less');
var Font = require('GLOBAL/font/optimusprinceps/style.css');

window.GAME = {
  ClientList:require('./js/ClientList.js'),
  Core:require('./js/Core.js'),
  Render:{
    Prepare : require('HOST/js/Prepare/Render.Prepare.js'),
    Main : require('HOST/js/Main/Render.Main.js'),
    End : require('HOST/js/Render.End.js')
  }
};
