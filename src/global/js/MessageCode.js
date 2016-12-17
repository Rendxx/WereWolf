var MSGCODE = {};

MSGCODE.HOST={
    UPDATE: 0,            // [ 0 | inited?1:0 | [ number | name | role ] | [player data list:([number, name])] | [player status list: (alive?1:0) ] ] // update client
};

MSGCODE.CLIENT={
    SET_INIT: 0,          // [ 0 |  number | name | role ] // send init data to host, once per game
    GET_INIT: 1,          // [ 1 ] // ask for init data from host
};

module.exports = MSGCODE;
