(function () {
  'use strict';
  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', Controller1)
    .directive('foundItems', FoundItemsDirective)
    .service('MenuSearchService', menuSearchServices)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: '../foundItems.html',
      scope: {
        onRemove: '&',
        foundItems: '<'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'syntax',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var list = this;

  }

  Controller1.$inject = ['MenuSearchService', '$http', 'ApiBasePath'];

  function Controller1(MenuSearchService) {
    var syntax = this;
    syntax.loader = false;
    syntax.table = false;

    syntax.searchFunction = function (val) {
      if (val === undefined || val.trim() === '') { // check if value is whitespace or undefined
        syntax.invalid = true;
      } else {
        syntax.invalid = false;
        MenuSearchService.getMatchedMenuItems(val.trim()); // call the getMatchedMenuItems Service and pass the user val
      }
    }

  }

  function menuSearchServices($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      service.foundItems = service.callServer(searchTerm);
      console.log(service.foundItems);
    }

    service.callServer = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
        var foundItems = result.data.menu_items;
        var found = [];
        for (let i = 0; i < foundItems.length; i++) {
          if (foundItems[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
            found.push(foundItems[i]);
          }
        }
        return found;
      }).catch(function (error) {
        console.log(error);
      });
    }
  
  }


})();