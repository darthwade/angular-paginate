/**
 * Angular Paginate
 * @homepage https://github.com/darthwade/angular-paginate
 * @author Vadym Petrychenko https://github.com/darthwade
 * @license The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @copyright 2014 Vadym Petrychenko
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('angular'));
  } else {
    // Browser globals
    factory(window.angular)
  }
}(function (angular) {
  'use strict';

  angular.module('darthwade.paginate', [])

    .provider('$paginate', function () {
      var provider = this;

      provider.templateUrl = 'angular-paginate.html';
      provider.options = {
        perPage: 10, // Items count per page.
        range: 5, // Number of pages neighbouring the current page which will be displayed.
        boundaryLinks: true, // Whether to display First / Last buttons.
        directionLinks: true, // Whether to display Previous / Next buttons.
        rotate: true, // Whether to keep current page in the middle of the visible ones.
        paramName: 'page',
        previousText: 'Previous', // Text for previous button
        nextText: 'Next', // Text for next button
        moreText: '...' // Text for more button
      };

      provider.$get = function() {
        var wrapper = function(options) {
          return new Paginator(options);
        };

        wrapper.getDefaultOptions = function() {
          return provider.options;
        };

        wrapper.getTemplateUrl = function() {
          return provider.templateUrl;
        };

        return wrapper;
      };

      /**
       * Overrides default options
       * @param {Object} options
       */
      provider.setDefaultOptions = function (options) {
        angular.extend(provider.options, options);
      };

      provider.setTemplateUrl = function (templateUrl) {
        provider.templateUrl = templateUrl;
      };

      var Paginator = function(options) {
        var self = this;
        var defaultOptions = {
          $page: 1,
          $objects: [],
          $totalCount: 0,
          $startIndex: 0,
          $endIndex: 0,
          $totalPages: 0,

          onPageChange: angular.noop
        };

        self.page = function (page) {
          if (self.$page === page) {
            return;
          }

          self.$page = page;
          calculate();

          if (self.onPageChange) {
            self.onPageChange.call(self);
          }
        };

        self.options = function (options) {
          angular.extend(self, options);
        };

        self.previous = function () {
          if (self.hasPrevious()) {
            self.page(self.$page - 1);
          }
        };

        self.next = function () {
          if (self.hasNext()) {
            self.page(self.$page + 1);
          }
        };

        self.hasPrevious = function () {
          return self.$page > 1;
        };

        self.hasNext = function () {
          return self.$page < self.$totalPages;
        };

        // Create page object used in template
        var makePage = function (number, text, active) {
          return {
            number: number,
            text: text,
            active: active
          };
        };

        var getPages = function () {
          var pages = [];

          // Default page limits
          var startPage = 1, endPage = self.$totalPages;
          var isRanged = self.range < self.$totalPages;

          // recompute if maxSize
          if (isRanged) {
            if (self.rotate) {
              // Current page is displayed in the middle of the visible ones
              startPage = Math.max(self.$page - Math.floor(self.range / 2), 1);
              endPage = startPage + self.range - 1;

              // Adjust if limit is exceeded
              if (endPage > self.$totalPages) {
                endPage = self.$totalPages;
                startPage = endPage - self.range + 1;
              }
            } else {
              // Visible pages are paginated with maxSize
              startPage = ((Math.ceil(self.$page / self.range) - 1) * self.range) + 1;

              // Adjust last page if limit is exceeded
              endPage = Math.min(startPage + self.range - 1, self.$totalPages);
            }
          }

          // Add page number links
          for (var number = startPage; number <= endPage; number++) {
            var page = makePage(number, number, number === self.$page);
            pages.push(page);
          }

          // Add links to move between page sets
          if (isRanged) { //  && !self.rotate
            var margin = self.boundaryLinks ? 1 : 0;
            if (startPage - margin > 1) {
              var previousPageSet = makePage(startPage - 1, self.moreText, false);
              pages.unshift(previousPageSet);
            }

            if (endPage + margin < self.$totalPages) {
              var nextPageSet = makePage(endPage + 1, self.moreText, false);
              pages.push(nextPageSet);
            }
          }

          // Add boundary links if needed
          if (self.boundaryLinks) {
            if (startPage > 1) {
              var firstPage = makePage(1, 1, false);
              pages.unshift(firstPage);
            }

            if (endPage < self.$totalPages) {
              var lastPage = makePage(self.$totalPages, self.$totalPages, false);
              pages.push(lastPage);
            }
          }

          return pages;
        };

        var calculate = function() {
          self.$page = parseInt(self.$page) || 1;
          self.$objects = self.$objects || [];
          self.$totalCount = parseInt(self.$totalCount) || 0;
          self.$totalPages = Math.ceil(self.$totalCount / self.perPage);
          self.$startIndex = (self.$page - 1) * self.perPage;
          self.$endIndex = self.$startIndex + self.$objects.length;
          if (self.$endIndex) {
            self.$startIndex += 1;
          }

          self.$pages = getPages();
        };

        angular.extend(self, provider.options, defaultOptions, options);
        calculate();
      };

      return provider;
    })

    .directive('dwPaginate', ['$paginate', function ($paginate) {
      return {
        restrict: 'EA',
        scope: {
          paginator: '=dwPaginate'
        },
        replace: true,
        templateUrl: $paginate.getTemplateUrl(),
        link: function (scope, element, attrs) {
        }
      };
    }]);

}));