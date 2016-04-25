/**
 * Created by superman on 2016/4/13.
 */
;(function(){
    'use strict';

    function EditorController(){
        var vm = this;
        vm.editor = '';
        vm.result = '';
        return vm;
    }

    function IndexController($localStorage, NoteService, $filter){
        var vm = this;
        vm.$storage = $localStorage;
        vm.editStatus = false;
        vm.categorySelected = 1;
        vm.noteSelected = 1;
        vm.openModal = false;
        vm.category = {};
        vm.note = {};
        vm.categoryList = [];
        vm.noteList = [];
        vm.note = {};

        //此时vm.categoryList 等于$localStorage.categoryList
        vm.categoryList = NoteService.getCategoryList();

        vm.edit = function(){
            vm.editStatus = true;
        };
        vm.save = function(){
            vm.editStatus = false;
        };

        vm.selectCategory = function(id){
            vm.categorySelected = id;
            vm.noteList = vm.categoryList[id - 1].noteList;
            vm.note = vm.noteList[0] || {};
        };
        vm.selectNote = function(note){
            vm.noteSelected = note.id;
            vm.note = note;
        };

        vm.open = function(type){
            vm.type = type;
            vm.openModal = true;
        };
        vm.add = function(type){
            //添加分类
            if(type == 'category'){
                var category = {
                    id : NoteService.generateId(vm.categoryList),
                    name : vm.name,
                    noteList : []
                };
                NoteService.saveCategory(category);
                vm.name = '';
                vm.openModal = false;
                vm.categorySelected = category.id;
                vm.noteList = vm.categoryList[vm.categorySelected - 1].noteList;
                vm.note = vm.noteList[0] || {};
            }
            //添加笔记本
            else if(type == 'note'){
                var note = {
                    id : NoteService.generateId(NoteService.getNoteListById(vm.categorySelected)),
                    title : vm.name,
                    createTime : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    updateTime : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                vm.note = NoteService.saveNote(vm.categorySelected, note);
                vm.name = '';
                vm.openModal = false;
                vm.noteSelected = note.id;
                vm.noteList = vm.categoryList[vm.categorySelected - 1].noteList;
            }

        };

        vm.cancel = function(){
            vm.openModal = false;
        };

        vm.delCategory = function(id){
            NoteService.deleteCategory(id);
            event.preventDefault();
        };

        vm.delNote = function(id){
            NoteService.deteleNote(id);
            event.preventDefault();
        }
    }

    IndexController.$inject = ['$localStorage', 'NoteService', '$filter'];
    angular.module('myApp.editor', ['ngRoute', 'hljs', 'editor.filter', 'ngStorage', 'editor.service'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
                .when('/editor', {
                    templateUrl : 'views/editor.html',
                    controller : 'EditorController'
                })
                .when('/index', {
                    templateUrl : 'views/index.html',
                    controller : 'IndexController'

                })
        }])
        .controller('EditorController', EditorController)
        .controller('IndexController', IndexController);
})();