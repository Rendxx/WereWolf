/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/

var Style = require('./less/Index.less');
var Font = require('GLOBAL/font/optimusprinceps/style.css');

window.GAME = {
  ClientList:require('HOST/js/ClientList.js'),
  Core:require('HOST/js/Core/Core.js'),
  Render:{
    Prepare : require('HOST/js/Prepare/Render.Prepare.js'),
    Main : require('HOST/js/Main/Render.Main.js'),
    End : require('HOST/js/Render.End.js')
  }
};

console.log('Werewolf v0.1.1');
