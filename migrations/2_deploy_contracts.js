var Owned = artifacts.require("./Owned.sol");
var narrativeChainy = artifacts.require("./narrativeChainy.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.link(Owned, narrativeChainy);
  deployer.deploy(narrativeChainy);
};
