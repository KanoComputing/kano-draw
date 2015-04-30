/*
 * Challenge Controller
 *
 * Controller for export modal
 */

var app = require('../app'),
    challenges = require('../challenges/index'),
    challengeAssert = require('../challenges/util/assert'),
    language = require('../language/index'),
    session = require('../language/session'),
    sound = require('../core/sound');

var SUCCESS_MESSAGES = [
        'Well done!',
        'Nice one!',
        'Cool beans!',
        'You Wizard!',
        'Keep casting!'
    ],
    HINT_HIGHLIGHT_DELAY = 10000;

app.controller('ChallengeController', function ($scope, $routeParams, $window, $timeout, $rootScope) {
    var win = angular.element($window),
        hintTimer;

    $scope.id = $routeParams.id ? parseInt($routeParams.id, 10) : 1;
    $scope.lastChallengeVisited.set($scope.id);
    $scope.content = challenges[$scope.id - 1];
    $scope.challenge = { code: $scope.content.code };
    $scope.hasNext = challenges.length > $scope.id;
    setStep(0);
    $scope.started = true;
    $scope.animationClass = '';

    $scope.$watch('step', function (step) {
        $scope.hint = $scope.content.steps[step] ? $scope.content.steps[step].hint : null;
        $scope.solution = $scope.getSolution();
        animateAndPlaySound(step);
    });

    /*
     * Initialise controller
     *
     * @return void
     */
    function init() {
        $scope.closeChallengeComplete();
    }

    /*
     * Show / Hide solution
     *
     * @return void
     */
    $scope.toggleSolution = function () {
        if (hintTimer) { $timeout.cancel(hintTimer); }
        $scope.highlightHelp = false;
        $scope.showSolution = !$scope.showSolution;
    };

    /*
     * Validate code to determine success of challenge
     *
     * @return void
     */
    $scope.validate = function () {
        // Next tick...
        setTimeout(function () {
            var code = language.strip($scope.challenge.code),
                step = 0,
                steps = $scope.content.steps,
                history = session.steps || [],
                assertObj = challengeAssert(code, history),
                validateStep, i, finished;

            for (i = $scope.step; i < steps.length; i += 1) {
                validateStep = steps[i].validate;

                if (validateStep.call(assertObj, code, history)) {
                    step = i + 1;
                }
            }

            if (step > $scope.step) {
                setStep(step);
            }

            if ($scope.step > steps.length - 1) {
                finished = true;
            }

            if (session.steps && finished) {
                $scope.completed = true;
                $rootScope.updateProgress($scope.id + 1);
            }

            $scope.$apply();
        });
    };

    /*
     * Set current challenge step
     *
     * @param {Number} index
     * @return void
     */
    function setStep(index) {
        if (hintTimer) { $timeout.cancel(hintTimer); }

        $scope.highlightHelp = false;

        $scope.step = index;
        $scope.showSolution = false;
        hintTimer = $timeout(function() {
            $scope.highlightHelp = true;
        }, HINT_HIGHLIGHT_DELAY);
    }

    /*
     * Get current step solution
     *
     * @return {String}
     */
    $scope.getSolution = function () {
        var content = $scope.content.steps[$scope.step];

        if (!content) { return null; }

        return content.solution;
    };

    /*
     * Show success message
     *
     * @return void
     */
    $scope.successMessage = function () {
        //If we are executing draw on Pi we want to show the xp gained
        var xpGain = parseInt($scope.xpGain, 10),
            successMsg = SUCCESS_MESSAGES[$scope.id % SUCCESS_MESSAGES.length],
            xpMessage = xpGain ? ' and earned ' + $scope.xpGain + 'xp!' : '',
            onlineMessage = successMsg + ' You completed challenge ' + $scope.id,
            offlineMessage = onlineMessage + xpMessage;

        return window.CONFIG.OFFLINE ? offlineMessage : onlineMessage; 
    };

    /*
     * Start challenge after reading the intro
     *
     * @return void
     */
    $scope.start = function () {
        $scope.started = true;
    };

    /*
     * Show complete challenge panel
     *
     * @return void
     */
    $scope.challengeComplete = function () {
        $scope.isChallengeCompleteOpen = true;
    };

    /*
     * Hide complete challenge panel
     *
     * @return void
     */
    $scope.closeChallengeComplete = function () {
        $scope.isChallengeCompleteOpen = false;
    };

    // Listen for key press
    win.bind('keydown', function (e) {
        if (e.keyCode === 27) { // ESC
            $scope.$apply();
        }
    });

    /*
     * Animate progress circle and play sound
     *
     * @return void
     */
    function animateAndPlaySound(step) {
        if (step > 0) {
            $scope.animationClass = 'animate-pulse';
            if (step < $scope.content.steps.length)
            {
                sound.play('pop');
            }
            else
            {
                sound.play('success');
            }

            $timeout(resetAnimation, 500);

            function resetAnimation() {
                $scope.animationClass = '';
            }
        }

    }

    /*
     * Close game completion modal
     *
     * @return void
     */
    $scope.openFinishedGame = function() {
        $scope.gameCompleteOpen = true;
    };

    /*
     * Close game completion modal
     *
     * @return void
     */
    $scope.closeFinishedGame = function() {
        $scope.challengeCompleteOpen = false;
    };

    init();
});
