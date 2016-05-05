/**
 * Created by superman on 2016/4/15.
 */

;(function () {
    'use strict';
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
        }])
        .filter('tree', ['TreeService', function (TreeService) {
            return function (items) {
                TreeService.enhance(items);
                return items;
            }
        }])
    ;
})();