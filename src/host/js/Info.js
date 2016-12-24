require('HOST/less/Info.less');

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
