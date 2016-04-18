/**
 * Created by superman on 2016/4/15.
 */

;(function () {
    'uss strict';
    angular.module('editor.filter', [])
        .filter('render', ['$sce', function ($sce) {
            return function (input) {
                if (!angular.isUndefined(input)) {
                    if (input.length != 0) {
                        input = marked(input);
                    }
                }

                return $sce.trustAsHtml(input);
            }
        }]);
})();