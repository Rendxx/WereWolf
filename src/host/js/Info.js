require('HOST/less/Info.less');

var ImgSrc = {
    day: require('GLOBAL/design/Role/day.png'),
    tomb: require('GLOBAL/design/Role/tomb.png'),
    werewolf: require('GLOBAL/design/Role/werewolf.png'),
    seer: require('GLOBAL/design/Role/seer.png'),
    hunter: require('GLOBAL/design/Role/hunter.png'),
    witch: require('GLOBAL/design/Role/witch.png'),
    elder: require('GLOBAL/design/Role/elder.png'),
    villager: require('GLOBAL/design/Role/villager.png')
}

var INFO = {
    SHOWPLAYER: function (number, name, content, cssClass){
      return [
        '<div class="info_client_showPlayer">',
          '<div style="color:#666;">'+(content || 'Your selection is:')+'</div>',
           '<div class="_checkBox_player_number">' + number + '</div>',
           '<div class="_checkBox_player_name">' + name + '</div>',
         '</div>'
       ].join('');
    }
}

module.exports = INFO;
