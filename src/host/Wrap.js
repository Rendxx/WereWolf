/* TODO:
    Fetch all modules and put them into a global object.
    Then we can use them in Host.html.
*/
require('./Wrap.less');
require('GLOBAL/font/optimusprinceps/style.css');

window.GAME = {
  ClientList:require('./content/ClientList.js'),
  Core:require('./content/Core/Core.js'),
  Render:{
    Prepare : require('./content/Render/Prepare/Render.Prepare.js'),
    Main : require('./content/Render/Main/Render.Main.js'),
    End : require('./content/Render/End/Render.End.js')
  }
};

console.log('Werewolf v0.2.1');
