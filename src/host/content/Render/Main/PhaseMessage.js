var PHASE = require('GLOBAL/content/PhaseCode.js');
require('./PhaseMessage.less');

var ImgSrc = {
    day: require('GLOBAL/design/Role/day.png'),
    night: require('GLOBAL/design/Role/night.png'),
    tomb: require('GLOBAL/design/Role/tomb.png'),
    werewolf: require('GLOBAL/design/Role/werewolf.png'),
    seer: require('GLOBAL/design/Role/seer.png'),
    hunter: require('GLOBAL/design/Role/hunter.png'),
    witch: require('GLOBAL/design/Role/witch.png'),
    elder: require('GLOBAL/design/Role/elder.png'),
    villager: require('GLOBAL/design/Role/villager.png')
}

var PHASEMESSAGE = {};
PHASEMESSAGE[PHASE.PREDAY]=[
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.day+'\')"></div>',
    '<div class="_phase_message_text">Day Time</div>',
  '</div>'
].join('');
PHASEMESSAGE[PHASE.DAY]= [
      '<div class="phase_message">',
        '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.day+'\')"></div>',
        '<div class="_phase_message_text">Vote Time</div>',
      '</div>'
    ].join('');
PHASEMESSAGE[PHASE.PRENIGHT]=[
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.night+'\')"></div>',
    '<div class="_phase_message_text">Night is coming</div>',
  '</div>'
].join('');
PHASEMESSAGE[PHASE.WOLF]= [
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.werewolf+'\')"></div>',
    '<div class="_phase_message_text">Werewolf Wake Up!</div>',
  '</div>'
    ].join('');
PHASEMESSAGE[PHASE.SEER]= [
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.seer+'\')"></div>',
    '<div class="_phase_message_text">Seer Wake Up!</div>',
  '</div>'
    ].join('');
PHASEMESSAGE[PHASE.WITCH]= [
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.witch+'\')"></div>',
    '<div class="_phase_message_text">Witch Wake Up!</div>',
  '</div>'
].join('');
PHASEMESSAGE[PHASE.ELDER]= [
  '<div class="phase_message">',
    '<div class="_phase_message_icon" style="background-image:url(\''+ImgSrc.elder+'\')"></div>',
    '<div class="_phase_message_text">Elder Wake Up!</div>',
  '</div>'
].join('');

module.exports = PHASEMESSAGE;
