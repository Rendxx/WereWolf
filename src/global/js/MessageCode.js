var MSGCODE = {};

MSGCODE.HOST={
    UPDATE: 0,            // [ 0 | step code | actived?1:0 | [player status list: (alive?1:0) ] | [vote list:(target idx | -1)] ] // update client
    END: 1,            // [ 1 | villager win ? 1:0 ] // send game result
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 |  number | name | role ] // send init data to host, once per game
    SELECT: 1,          // [ 1 | target idx ] // select a player by its index
};

// Client setup:  [ init: (0:1:2） | client index |  player number | [ role list ] | [ number | name | role ] | [player data list:([number, name])] ]

module.exports = MSGCODE;
