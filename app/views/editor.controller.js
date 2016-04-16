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
        vm.categorySelected = 0;
        vm.noteSelected = 0;
        vm.openModal = false;
        vm.noteList = [];
        vm.note = {};
        vm.categoryList = [
            {
                id: 1, name: '分类1',
                note: [
                    {
                        id: 1, title: '笔记1', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 2, title: '笔记2', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 3, title: '笔记3', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    }
                ]
            },
            {
                id: 2, name: '分类2',
                note: [
                    {
                        id: 1, title: '笔记4', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 2, title: '笔记5', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 3, title: '笔记6', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    }
                ]
            },
            {
                id: 3, name: '分类3',
                note: [
                    {
                        id: 1, title: '笔记6', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 2, title: '笔记7', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    },
                    {
                        id: 3, title: '笔记8', content: '# header', createTime: '2016-4-4', updateTime: '2016-4-5'
                    }
                ]
            }
        ];
        vm.edit = function () {
            vm.editStatus = true;
        };
        vm.save = function () {
            vm.editStatus = false;
        };

        vm.selectCategory = function (id) {
            vm.categorySelected = id;
            vm.noteList = vm.categoryList[id - 1].note;
        };
        vm.selectNote = function (note) {
            vm.noteSelected = note.id;
            vm.note = note;
        };

        vm.open = function (type) {
            vm.type = type;
            vm.openModal = true;
        };
        vm.add = function () {
            if (vm.type == '分类') {
                vm.note = {
                    id: vm.categoryList.length + 1,
                    name: vm.name,
                    note: {}
                };
                vm.categoryList.push(vm.note);
            }
            else if (vm.type == '笔记本') {
            }
            vm.openModal = false;
        };
        vm.cancel = function () {
            vm.openModal = false;
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