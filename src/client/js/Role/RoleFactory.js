var ROLEDATA = require('GLOBAL/js/RoleData.js');

var RoleFactory = function (roleCode) {
    if (!ROLEDATA.hasOwnProperty(roleCode)) return null;
    var handler = ROLEDATA[roleCode].handler;

    var role_constructor = require('CLIENT/js/Role/Role.'+handler+'.js');
    return new role_constructor();
};
module.exports = RoleFactory;
