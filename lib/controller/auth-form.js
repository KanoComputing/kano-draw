'use strict';
/*
 * Login Form Controller
 *
 * Opens up the login form.
 */

var app = require('../app'),
    analytics = require('../core/analytics');

app.controller('AuthController', ['$scope', '$rootScope', '$element', 'API', 'AUTH', function ($scope, $rootScope, $element, api, auth) {
    var loginForm = $element.find('kano-login-form')[0],
        signupForm = $element.find('kano-signup-form')[0];

    $scope.mode = 'login';
    $scope.toggleMode = function () {
        $scope.mode = $scope.mode === 'login' ? 'signup' : 'login';
    };

    $scope.onSuccess = function (ev) {
        $scope.$apply(function () {
            auth.login(ev.details);
            $rootScope.loggedIn = auth.getState();
            $rootScope.user = auth.getUser();
            $rootScope.auth.closeModal();
        });
    };

    $scope.onLoginSuccess = function (ev) {
        var user = ev.details.user;
        analytics.event('Login success', {
            id: user.id,
            email: user.email,
            username: user.username
        });
    };

    $scope.onSignupSuccess = function (ev) {
        var user = ev.details.user;
        analytics.event('Registration Completed', {
            username: user.username
        });
    };

    $scope.close = function () {
        $rootScope.auth.closeModal();
    };

    loginForm.addEventListener('success', $scope.onLoginSuccess);
    loginForm.addEventListener('success', $scope.onSuccess);
    signupForm.addEventListener('success', $scope.onSignupSuccess);
    signupForm.addEventListener('success', $scope.onSuccess);

    loginForm.addEventListener('signup-click', $scope.$apply.bind($scope, $scope.toggleMode));
    signupForm.addEventListener('login-click', $scope.$apply.bind($scope, $scope.toggleMode));

}]);
