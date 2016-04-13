/**
 * Created by superman on 2016/4/13.
 */
(function () {
    'use strict';

    function EditorController() {
        var vm = this;
        vm.editor = '';
        vm.result = '';
        return vm;
    }

    angular.module('myApp.editor', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/editor', {
                    templateUrl: 'views/editor.html',
                    controller: 'EditorController'
                })
        }])
        /*.directive('markdown', ['$timeout',function ($timeout) {
         return{
         restrict: 'EA',
         require: 'ngModel',
         link: function ($scope, element, attrs, ctrl) {
         console.log($scope.editor);
         var text = marked($(element).text());
         $timeout(function () {
         $scope.result = text;
         })
         }
         }
         }])*/
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                if (text == null || text == [] || text == undefined || text == "")return "";
                return $sce.trustAsHtml(text);
            };
        }])
        .filter('markdown', ['$sce',function ($sce) {
            return function (input) {
                if (input.length != 0) {
                    input = marked(input);
                }
                return $sce.trustAsHtml(input);
            }
        }])
        .controller('EditorController', EditorController);
})();