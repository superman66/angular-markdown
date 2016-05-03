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
            var index = -1;
            list.forEach(function(value, i){
                if(value.id == id){
                    index = i;
                }
            });
            return index;
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
            var index = getIndexById(getCategoryList(), id);
            return $localStorage.categoryList[index].noteList;
        }

        function getNoteById(categoryId, noteId){
            var noteList = getNoteListById(categoryId).filter(function(x){
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
            var categoryIndex = getIndexById(getCategoryList(), categoryId);
            if(categoryIndex != -1){
                $localStorage.categoryList[categoryIndex].noteList.push(note);
            }
            return note;
        }

        function updateNote(categoryId, note){
            var categoryIndex = getIndexById(getCategoryList(), categoryId);
            var noteList = getNoteListById(categoryId);
            if(note.id){
                var noteIndex = getIndexById(noteList, note.id);
                noteList[noteIndex] = note;
                $localStorage.categoryList[categoryIndex].noteList = noteList;
            }
        }

        function deleteCategory(id){
            var index = getIndexById(getCategoryList(), id);
            $localStorage.categoryList.splice(index, 1);

        }

        function deleteNote(categoryId, id){
            var categoryIndex = getIndexById(getCategoryList(), categoryId);
            var noteIndex = getIndexById(getNoteListById(categoryId), id);
            $localStorage.categoryList[categoryIndex].noteList.splice(noteIndex, 1);
        }
    }

    NoteService.$inject = ['$localStorage'];
    angular.module('editor.service', [])
        .factory('NoteService', NoteService);
})();
