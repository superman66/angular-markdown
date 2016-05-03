/**
 * Created by superman on 2016/4/15.
 */
angular.module('editor.directive', [])
    .directive('fullScreen', function () {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, elements, attr) {
                var categoryTarget = attr.categorytarget;
                var noteTarget = attr.notetarget;
                var editorTarget = attr.editortarget;
                var fullScreenEvent = {
                    fullScreen: function (categoryTarget, noteTarget, editorTarget) {
                        $('#' + categoryTarget).addClass('category-menu-move');
                        $('#' + noteTarget).addClass('note-menu-move');
                        $('#' + editorTarget).addClass('editor-move');
                    },
                    exitFullScreen: function (categoryTarget, noteTarget, editorTarget) {
                        $('#' + categoryTarget).removeClass('category-menu-move');
                        $('#' + noteTarget).removeClass('note-menu-move');
                        $('#' + editorTarget).removeClass('editor-move');
                    }
                };
                $scope.fullScreenText = '全屏编辑';
                $scope.fullScreenFlag = false;  //全屏状态
                $scope.toggleFullScreen = function () {
                    if ($scope.fullScreenFlag) { //处于全屏状态
                        $scope.fullScreenText = '全屏编辑';
                        fullScreenEvent.exitFullScreen(categoryTarget, noteTarget, editorTarget);
                    }
                    else {
                        $scope.fullScreenText = '退出全屏';
                        fullScreenEvent.fullScreen(categoryTarget, noteTarget, editorTarget);
                    }
                    $scope.fullScreenFlag = !$scope.fullScreenFlag;
                }
            }
        }
    });
