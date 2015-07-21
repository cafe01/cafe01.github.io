/*jslint sloppy: true,  white: true,  plusplus: true, nomen: true */
/*global angular, _, console*/
var app = angular.module('Simulator', []);

app.controller('MainController', function ($scope) {

    $scope.report = {};
    $scope.numeroBolas = 100;

    $scope.runSimulation = function (loopcount) {
        var min = 0,
            max = 37,
            black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
            balls = {},
            chance = {},
            report = {},
            i, n, color, type;

        // reset

        // run
        for  (i = 0; i < loopcount; i = i + 1) {
            n = Math.floor(Math.random() * (max - min) + min);
            // console.log(n);

            balls[n] = balls[n] || 0;
            balls[n]++;

            if (n === 0) {
                chance.zero = chance.zero || 0;
                chance.zero++;
            }
            else {

                color = (_.indexOf(black, n) > -1) ? 'black' : 'red';
                type  = n % 2 === 0  ? 'even'  : 'odd';


                chance[type] = chance[type] || 0;
                chance[color] = chance[color] || 0;
                chance[color + '_' + type] = chance[color + '_' + type] || 0;

                chance[type]++;
                chance[color]++;
                chance[color + '_' + type]++;
            }
        }

        // build report
        report.balls = _.pairs(balls).sort(function(a, b){
            return a[1] === b[1] ? 0 :
                   a[1] < b[1]   ? 1 : -1;
        });

        report.chances = _.pairs(chance).sort(function(a, b){
            return a[0].localeCompare(b[0]);
        });

        report.total = loopcount;
        report.bestBall = report.balls[0];
        report.worstBall = _.last(report.balls);

        $scope.report = report;

        // console.log('balls', report.balls);
        // console.log('chance', chance);
    };

    $scope.runSimulation($scope.numeroBolas);
});
