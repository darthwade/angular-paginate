# Angular Paginate
[![Gittip](http://img.shields.io/gittip/darthwade.svg)](https://www.gittip.com/darthwade/)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=darthwade&url=https://github.com/darthwade/angular-paginate&title=Angular%20Paginate&language=&tags=github&category=software) 

Most clean, powerful and customizable pagination for angular.

## Installation

Using `bower`:
```shell 
$ bower install angular-paginate --save
```

Using `git`:
```shell 
$ git clone https://github.com/darthwade/angular-paginate.git
```

## Requirements & Dependencies
- Angular

## Usage

Add `angular-paginate.min.js` to your HTML.
``` html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js"></script>
<script src="//rawgithub.com/darthwade/angular-paginate/master/angular-paginate.min.js"></script>
```

Add `darthwade.paginate` as a module dependency for your app.
``` javascript
angular.module('myApp', ['darthwade.paginate']);
```

## Example

``` html
<div ng-controller="MainCtrl">
  <h1>Numbers List</h1>
  <div class="numbers">
    <div ng-repeat="number in numbers.$objects track by $index">Number {{number}}</div>
  </div>

  <div>{{numbers.$startIndex}}-{{numbers.$endIndex}} of {{numbers.$totalCount}}</div>
  <div dw-paginate="numbers" class="pagination-sm"></div>
</div>
```
``` javascript
  angular.module('demoApp', [
        'darthwade.paginate'
      ])

      .config(function($paginateProvider) {
        $paginateProvider.setTemplateUrl('../angular-paginate.html');
      })

      .controller('MainCtrl', function ($scope, $q, $timeout, $paginate) {

        var getNumbers = function() {
          var deferred = $q.defer();

          $timeout(function() {
            var numbers = [];
            for (var i = 0; i < 10; i++) {
              numbers.push(Math.floor(Math.random() * 11));
            }
            deferred.resolve(numbers);
          }, 20);

          return deferred.promise;
        };


        $scope.loadNumbers = function(page) {

          getNumbers()
              .then(function(numbers) {
                $scope.numbers = $paginate({
                  $objects: numbers,
                  $totalCount: numbers.length * 10,
                  $page: page,
                  onPageChange: function() {
                    $scope.loadNumbers(this.$page);
                  },
                  perPage: 10, // Items count per page.
                  range: 5, // Number of pages neighbouring the current page which will be displayed.
                  boundaryLinks: true, // Whether to display First / Last buttons.
                  directionLinks: true, // Whether to display Previous / Next buttons.
                  rotate: true, // Whether to keep current page in the middle of the visible ones.
                  paramName: 'page',
                  previousText: 'Previous', // Text for previous button
                  nextText: 'Next' // Text for next button
                });
              });
        };

        $scope.loadNumbers(1);
      });
```

## Options

``` javascript
{
  perPage: 10, // Items count per page.
  range: 5, // Number of pages neighbouring the current page which will be displayed.
  boundaryLinks: true, // Whether to display First / Last buttons.
  directionLinks: true, // Whether to display Previous / Next buttons.
  rotate: true, // Whether to keep current page in the middle of the visible ones.
  paramName: 'page',
  previousText: 'Previous', // Text for previous button
  nextText: 'Next', // Text for next button
  moreText: '...' // Text for more button
}
```

## API

`$paginateProvider.getDefaultOptions()` - Returns default options.
`$paginateProvider.getTemplateUrl()` - Returns dw-paginate directive template URL.
`$paginateProvider.setDefaultOptions(options)` - Overrides default options.
`$paginateProvider.setTemplateUrl(templateUrl)` - Sets dw-paginate directive template URL.

## Styling
``` html
<ul class="dw-paginate pagination" ng-show="paginator.$totalPages > 1">
  <li ng-if="paginator.directionLinks" ng-class="{disabled: !paginator.hasPrevious()}" class="dw-paginate-previous">
    <a href ng-click="paginator.previous()">{{paginator.previousText}}</a>
  </li>
  <li ng-repeat="page in paginator.$pages track by $index" ng-class="{active: page.active}" class="dw-paginate-page">
    <a href ng-click="paginator.page(page.number)">{{page.text}}</a>
  </li>
  <li ng-if="paginator.directionLinks" ng-class="{disabled: !paginator.hasNext()}" class="dw-paginate-next">
    <a href ng-click="paginator.next()">{{paginator.nextText}}</a>
  </li>
</ul>
```

## Testing
```shell 
$ git clone https://github.com/darthwade/angular-paginate.git
$ cd angular-paginate
$ vagrant up
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests and examples for any new or changed functionality.

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

Licensed under the MIT License. See the LICENSE file for details.

Copyright (c) 2014 [Vadym Petrychenko](http://petrychenko.com/)