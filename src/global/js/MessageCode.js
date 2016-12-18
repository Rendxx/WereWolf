var MSGCODE = {};

MSGCODE.HOST={
    INIT_DATA: 0,            // [ 0 | inited?1:0 | [ number | name | role ] | [player data list:([number, name])] ] // ssend init data to client
    UPDATE: 1,            // [ 1 | step code | actived?1:0 | [player status list: (alive?1:0) ] | [vote list:(target idx | -1)] ] // update client
    END: 2,            // [ 2 | villager win ? 1:0 ] // send game result
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 |  number | name | role ] // send init data to host, once per game
    GET_INIT: 1,          // [ 1 ] // ask for init data from host
    SELECT: 2,          // [ 2 | target idx ] // select a player by its index
};

// Client setup:  [ client index |  player number | [ role list ] ]

module.exports = MSGCODE;
