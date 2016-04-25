/**
 * Created by superman on 2016/4/17.
 */
;(function(){
    "use strict";
    function NoteService($localStorage){
        return {
            generateId : generateId,
            getCategoryList : getCategoryList,
            getNoteListById : getNoteListById,
            getNoteById : getNoteById,
            saveCategory : saveCategory,
            updateCategory : updateCategory,
            saveNote : saveNote,
            updateNote : updateNote,
            deleteCategory : deleteCategory,
            deleteNote : deleteNote
        };

        /**
         * 根据Id查找元素在数组中的index
         * @param list
         * @param id
         */
        function getIndexById(list, id){
            return list.indexOf(id);
        }

        function generateId(list){
            console.log(list);

            return list.length == 0 ? 1 : list[list.length - 1].id + 1;
        }

        function getCategoryList(){
            if(!$localStorage.categoryList){
                $localStorage.categoryList = [];
            }
            return $localStorage.categoryList;
        }

        function getNoteListById(id){
            return $localStorage.categoryList[id - 1].noteList;
        }

        function getNoteById(categoryId, noteId){
            var noteList = _getNoteListById(categoryId).filter(function(x){
                return x.id == noteId;
            });
            return noteList.length == 0 ? null : noteList[0];
        }

        function saveCategory(category){
            $localStorage.categoryList.push(category);
        }

        function updateCategory(category){
            if(category.id){
                $localStorage.categoryList[category.id - 1] = category;
            }
        }

        function saveNote(categoryId, note){
            $localStorage.categoryList[categoryId - 1].noteList.push(note);
            return note;
        }

        function updateNote(categoryId, note){
            var noteList = _getNoteListById(categoryId);
            if(note.id){
                noteList[note.id - 1] = note;
                $localStorage.categoryList[categoryId - 1].noteList = noteList;
            }
        }

        function deleteCategory(id){
            id = id - 1;
            $localStorage.categoryList.splice(id, 1);

        }

        function deleteNote(categoryId, id){
            id = id - 1;
            $localStorage.categoryList[categoryId - 1].noteList.splice(id, 1);
        }
    }

    NoteService.$inject = ['$localStorage'];
    angular.module('editor.service', [])
        .factory('NoteService', NoteService);
})();
