var MSGCODE = {};

MSGCODE.HOST={
    UPDATE: 0,            // [ 0 | step code | [ number | name | role ] | [player data list:([number, name])] | [player status list: (alive?1:0) ] | [vote list:(target idx | -1)] ] // update client
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 |  number | name | role ] // send init data to host, once per game
    GET_INIT: 1,          // [ 1 ] // ask for init data from host
    SELECT: 2,          // [ 2 | target idx ] // select a player by its index
};

// Client setup:  [ client index |  player number | [ role list ] ]

module.exports = MSGCODE;
