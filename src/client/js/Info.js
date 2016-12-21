require('CLIENT/less/Info.less');

var ImgSrc = {
    day: require('GLOBAL/design/Role/day.png'),
    tomb: require('GLOBAL/design/Role/tomb.png'),
    werewolf: require('GLOBAL/design/Role/werewolf.png'),
    seer: require('GLOBAL/design/Role/seer.png'),
    hunter: require('GLOBAL/design/Role/hunter.png'),
    witch: require('GLOBAL/design/Role/witch.png'),
    elder: require('GLOBAL/design/Role/elder.png')
}

var INFO = {
    DAY: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.day+'\')"></div>',
        '<div class="_text">It\'s a new day.<br/>Share your idea and vote.<br/>Someone will be executed.</div>',
      '</div>'
    ].join(''),
    DAED: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.tomb+'\')"></div>',
        '<div class="_text">You are dead.<br/>Rest in peace.</div>',
      '</div>'
    ].join(''),
    DAED_HUNTER: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.hunter+'\')"></div>',
        '<div class="_text">You are dead.<br/>Take your revenge with 1 shot.</div>',
      '</div>'
    ].join(''),
    DAED_HUNTER2: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.tomb+'\')"></div>',
        '<div class="_text">You are dead quietly.<br/>But you <b>CANNOT</b> shoot for some reason.</div>',
      '</div>'
    ].join(''),
    WEREWOLF: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.werewolf+'\')"></div>',
        '<div class="_title">Murder Someone!</div>',
        '<div class="_text">Decision will be made if all werewolvies choose the same target.<br/>You can change your target before that.</div>',
      '</div>'
    ].join(''),
    WITCH: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.witch+'\')"></div>',
        '<div class="_text">Now is the time for potion.</div>',
      '</div>'
    ].join(''),
    SEER: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.seer+'\')"></div>',
        '<div class="_text">Now is the time for magic.</div>',
      '</div>'
    ].join(''),
    ELDER: [
      '<div class="info_client">',
        '<div class="_icon" style="background-image:url(\''+ImgSrc.elder+'\')"></div>',
        '<div class="_text">&quot; Hey, You. Just shut up. &quot;</div>',
      '</div>'
    ].join(''),
    CHECKPLAYER: function (number, name, content){
      return [
        '<div class="info_client_checkPlayer">',
          '<div style="color:#666;">'+(content || 'Your selection is:')+'</div>',
           '<div class="_checkBox_player_number">' + number + '</div>',
           '<div class="_checkBox_player_name">' + name + '</div>',
         '</div>'
       ].join('');
    }
}

module.exports = INFO;
