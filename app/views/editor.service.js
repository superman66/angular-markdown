/**
 * Created by superman on 2016/4/17.
 */
(function () {
    "use strict"
    function NoteService($localStorage, $filter) {

        var _getCategoryList = function () {
            return $localStorage.categoryList;
        };
        var _getNoteListById = function (id) {
            var categoryList = _getCategoryList();
            return categoryList[id - 1].note;
        };
        var _getNoteById = function (categoryId, noteId) {
            var noteList = _getNoteListById(categoryId);
            return noteList[noteId - 1];
        };
        var _saveCategory = function (name) {
            var categoryList = _getCategoryList();
            var category = {
                id: categoryList.length + 1,
                name: name,
                note: []
            };
            categoryList.push(category);
            $localStorage.categoryList = categoryList;
        };

        var _saveNote = function (categoryId, name) {
            var categoryList = _getCategoryList();
            var noteList = _getNoteListById(categoryId);
            var note = {
                id: vm.categoryList.length + 1,
                title: vm.name,
                createTime: $filter.('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                updateTime: $filter.('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
            };
            console.log(vm.categoryList[vm.categorySelected - 1]);
            vm.noteList = vm.categoryList[vm.categorySelected - 1].note;

            vm.noteList.push(vm.note);
            vm.categoryList[vm.categorySelected - 1].note = vm.noteList;
        };
        var _updateNote = function (note) {

        };
        var deleteCategory = function (id) {

        };
        var deleteNote = function (id) {

        };
        return {
            saveNote: _saveNote
        }
    }

    angular.module('editor.service', [])
        .factory('NoteService', NoteService);
})();
