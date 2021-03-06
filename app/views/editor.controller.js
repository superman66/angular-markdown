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
        vm.editStatus = false;
        vm.categorySelected = 0;
        vm.noteSelected = 0;
        vm.openModal = false;
        vm.category = {};
        vm.note = {};
        vm.categoryList = [];
        vm.noteList = [];
        vm.note = {};

        var Note = {
            init: function () {
                this.initCategory();
                if (vm.categorySelected) {
                    this.initNote(vm.categorySelected);
                }
            },
            initCategory: function () {
                //此时vm.categoryList 等于$localStorage.categoryList
                vm.categoryList = NoteService.getCategoryList();
                if (vm.categoryList.length != 0) {
                    vm.categorySelected = vm.categoryList[0].id;
                }
            },
            initNote: function (id) {
                vm.noteList = NoteService.getNoteListById(id);
                if (vm.noteList.length != 0) {
                    vm.note = vm.noteList[0];
                    vm.noteSelected = vm.note.id;
                }
            },
            resetNote: function () {
                vm.note = {};
            }
        };
        //初始化显示
        Note.init();
        vm.edit = function () {
            vm.editStatus = true;
        };
        /**
         * 保存修改的note
         */
        vm.save = function () {
            vm.editStatus = false;
            vm.note.updateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            NoteService.updateNote(vm.categorySelected, vm.note);
        };

        vm.selectCategory = function (id) {
            vm.categorySelected = id;
            Note.initNote(id);
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
                vm.openModal = false;
                vm.categorySelected = category.id;
                Note.initNote(vm.categorySelected);
            }
            //添加笔记本
            else if (type == 'note') {
                var note = {
                    id: NoteService.generateId(NoteService.getNoteListById(vm.categorySelected)),
                    title: vm.name,
                    tag: [],
                    createTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    updateTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                vm.note = NoteService.saveNote(vm.categorySelected, note);
                vm.name = '';
                vm.openModal = false;
                vm.noteSelected = note.id;
                vm.noteList = NoteService.getNoteListById(vm.categorySelected);
            }

        };

        vm.cancel = function () {
            vm.openModal = false;
        };

        vm.delCategory = function (id) {
            NoteService.deleteCategory(id);
            event.preventDefault();
        };

        vm.delNote = function (id) {
            NoteService.deleteNote(vm.categorySelected, id);
            Note.resetNote();
            event.preventDefault();
        };

        vm.addTag = function () {
            if (!angular.isUndefined(vm.tag)) {
                vm.note.tag.push(vm.tag);
                vm.tag = '';
                NoteService.updateNote(vm.categorySelected, vm.note);
            }
        };

        vm.delTag = function (tag) {
            NoteService.delTag(vm.categorySelected, vm.noteSelected, tag);
        }

    }

    IndexController.$inject = ['$localStorage', 'NoteService', '$filter'];

    function TreeController(TreeService) {
        var vm = this;
        vm.items = [
            {
                id: 1,
                title: '主题1',
                poster: 'superman',
                createDate: '2016-5-5',
                items: [
                    {
                        id: 11,
                        title: '主题1.1',
                        poster: 'superman',
                        createDate: '2016-5-5',
                        items: [
                            {
                                id: 111,
                                title: '主题1.1.1',
                                poster: 'superman',
                                createDate: '2016-5-5'
                            },
                            {
                                id: 112,
                                title: '主题1.1.2',
                                poster: 'superman',
                                createDate: '2016-5-5'
                            }
                        ]
                    },
                    {
                        id: 12,
                        title: '主题1.2',
                        poster: 'superman',
                        createDate: '2016-5-5',
                        items: [
                            {
                                id: 113,
                                title: '主题1.2.1',
                                poster: 'superman',
                                createDate: '2016-5-5'
                            },
                            {
                                id: 114,
                                title: '主题1.2.2',
                                poster: 'superman',
                                createDate: '2016-5-5'
                            }
                        ]
                    }
                ]
            }
        ];

       // TreeService.enhance(vm.items);

    }

    TreeController.$inject = ['TreeService'];
    angular.module('myApp.editor', ['ngRoute', 'hljs', 'editor.filter', 'ngStorage', 'editor.service', 'editor.directive'])
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
                .when('/tree', {
                    templateUrl: 'views/tree.html',
                    controller: 'TreeController'
                })
        }])
        .controller('EditorController', EditorController)
        .controller('IndexController', IndexController)
        .controller('TreeController', TreeController)
    ;
})();