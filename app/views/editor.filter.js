/**
 * Created by superman on 2016/4/15.
 */
angular.module('myApp.editor.filter', [])
    .filter('render', ['$sce', function ($sce) {
        return function (input) {
            if (input.length != 0) {
                input = marked(input);
            }
            return $sce.trustAsHtml(input);
        }
    }]);