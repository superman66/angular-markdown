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

    function IndexController($localStorage) {
        var vm = this;
        vm.$storage = $localStorage;
        vm.editStatus = false;
        vm.note = {
            title: '笔记title',
            content: '笔记的内容',
            createTime: '2016-4-3',
            updateTime: '2016-4-4'
        };
        vm.categoryList = [
            {id: 1, name: '分类1'},
            {id: 2, name: '分类2'},
            {id: 3, name: '分类3'},
            {id: 4, name: '分类4'},
            {id: 5, name: '分类5'}
        ];
        vm.edit = function () {
            vm.editStatus = true;
        };
        vm.save = function () {
            vm.editStatus = false;
        }
    }

    IndexController.$inject = ['$localStorage'];
    angular.module('myApp.editor', ['ngRoute', 'hljs', 'myApp.editor.filter', 'ngStorage'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/editor', {
                    templateUrl: 'views/editor.html',
                    controller: 'EditorController'
                })
                .when('/index', {
                    templateUrl: 'views/index.html',
                    controller: 'IndexController'

                })
        }])
        .controller('EditorController', EditorController)
        .controller('IndexController', IndexController);
})();