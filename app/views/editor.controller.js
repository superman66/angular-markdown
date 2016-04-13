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
        .directive('markdown', [function () {
            return {
                restrict: 'EA',
                link: function ($scope, element, attrs) {
                    hljs.initHighlightingOnLoad();
                }
            }
        }])
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                if (text == null || text == [] || text == undefined || text == "")return "";
                return $sce.trustAsHtml(text);
            };
        }])
        .filter('render', ['$sce', function ($sce) {
            return function (input) {
                if (input.length != 0) {
                    input = marked(input);
                }
                return $sce.trustAsHtml(input);
            }
        }])
        .controller('EditorController', EditorController);
})();