/*jslint sloppy: true,  white: true,  plusplus: true, nomen: true */
/*global angular, _, console*/
var app = angular.module('Simulator', []);

app.controller('MainController', function ($scope) {

    $scope.numeroBolas = 10;
    $scope.report = {};
    $scope.bets = {
        black: true,
        red: false,
        even: true,
        odd: false,
        zero: false
    };

    $scope.toggleBet = function (bet) {
        this.bets[bet] = !this.bets[bet];
    };

    $scope.runSimulation = function (loopcount) {
        var min = 0,
            max = 37,
            black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
            balls = {},
            chance = {},
            report = {},
            bets = this.bets,
            roundCost = _.filter(_.values(bets), function(bet) { return bet === true; }).length,
            betsReport = { won: 0, lost: 0, tie: 0 },
            money = 0,
            roundEarnings,
            i, n, color, type;

        // run
        for  (i = 0; i < loopcount; i = i + 1) {
            n = Math.floor(Math.random() * (max - min) + min);

            balls[n] = balls[n] || 0;
            balls[n]++;

            // money
            roundEarnings = 0;
            money -= roundCost;

            if (n === 0) {
                chance.zero = chance.zero || 0;
                chance.zero++;

                if (bets.zero) {
                    roundEarnings += 2;
                }
            }
            else {

                color = (_.indexOf(black, n) > -1) ? 'black' : 'red';
                type  = n % 2 === 0  ? 'even'  : 'odd';

                // bets
                if (bets[color]) {
                    roundEarnings += 2;
                }

                if (bets[type]) {
                    roundEarnings += 2;
                }

                // stats
                chance[type] = chance[type] || 0;
                chance[color] = chance[color] || 0;
                chance[color + '_' + type] = chance[color + '_' + type] || 0;

                chance[type]++;
                chance[color]++;
                chance[color + '_' + type]++;
            }

            // money
            money += roundEarnings;

            if (roundEarnings > roundCost) {
                betsReport.won++;
            }
            else if (roundEarnings < roundCost) {
                betsReport.lost++;
            }
            else {
                betsReport.tie++;
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

        report.money = money;
        report.bets = betsReport;
        report.total = loopcount;
        report.bestBall = report.balls[0];
        report.worstBall = _.last(report.balls);

        $scope.report = report;

        // console.log('balls', report.balls);
        // console.log('chance', chance);
    };

    $scope.runSimulation($scope.numeroBolas);
});
