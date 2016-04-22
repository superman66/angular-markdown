/**
 * Created by superman on 2016/4/13.
 */
;(function () {
    'use strict';

    function EditorController() {
        var vm = this;
        vm.editor = '';
        vm.result = '';
        return vm;
    }

    function IndexController($localStorage, NoteService, $filter) {
        var vm = this;
        vm.$storage = $localStorage;
        $localStorage.categoryList = [];
        vm.editStatus = false;
        vm.categorySelected = 1;
        vm.noteSelected = 1;
        vm.openModal = false;
        vm.category = {};
        vm.note = {};
        vm.categoryList = [];
        vm.noteList = [];
        vm.note = {};


        vm.categoryList = NoteService.getCategoryList();

        vm.edit = function () {
            vm.editStatus = true;
        };
        vm.save = function () {
            vm.editStatus = false;
        };

        vm.selectCategory = function (id) {
            vm.categorySelected = id;
            vm.noteList = vm.categoryList[id - 1].noteList;
        };
        vm.selectNote = function (note) {
            vm.noteSelected = note.id;
            vm.note = note;
        };

        vm.open = function (type) {
            vm.type = type;
            vm.openModal = true;
        };
        vm.add = function (type) {
            //添加分类
            if (type == 'category') {
                var category = {
                    id: NoteService.generateId(vm.categoryList),
                    name: vm.name,
                    noteList: []
                };
                NoteService.saveCategory(category);
                vm.name = '';
                console.log(vm.categoryList);
                vm.openModal = false;
            }
            //添加笔记本
            else if (type == 'note') {
                var note = {
                    id: NoteService.generateId(),
                    title: vm.name,
                    createTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    updateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                NoteService.saveNote(note);
                console.log(vm.categoryList);
                vm.noteList = vm.categoryList[vm.categorySelected - 1].noteList;

                vm.noteList.push(vm.note);
                vm.categoryList[vm.categorySelected - 1].noteList = vm.noteList;
                vm.name = '';
                vm.openModal = false;
            }

        };

        vm.cancel = function () {
            vm.openModal = false;
        };

        vm.deleteCategory = function (id) {

        };

        vm.deleteNote = function (id) {

        }
    }

    IndexController.$inject = ['$localStorage', 'NoteService', '$filter'];
    angular.module('myApp.editor', ['ngRoute', 'hljs', 'editor.filter', 'ngStorage', 'editor.service'])
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