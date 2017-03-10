var MSGCODE = {};

MSGCODE.HOST={
    END: 0,            // [ 0 | villager win ? 1:0 ] // send game result
    UPDATE: 1,         // [ 1 | phase code | actived?1:0 | [player alive list: (alive?1:0) ] | [player status ] | [ action data ] | [ action result ] ] // update client
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 | number | name | role ] // send init data to host, once per game
    DECISION: 1,          // [ 1 | decision ] // select a player by its index
};

// Client setup:  [ init: (0:1:2） | player index |  player amount | [ role list ] | [ number | name | role ] | [player data list:([number, name])] ]

module.exports = MSGCODE;
