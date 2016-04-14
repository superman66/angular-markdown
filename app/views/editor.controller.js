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
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    angular.module('myApp.editor', ['ngRoute', 'hljs'])
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
                }
            }
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