var app = require('./app');

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: '/main.html', controller: 'MainController' })
    .when('/level', { templateUrl: '/level.html', controller: 'LevelController' })
    .when('/level/:id', { templateUrl: '/level.html', controller: 'LevelController' })
    .when('/playground', { templateUrl: '/playground.html', controller: 'PlaygroundController' })
    .when('/share/:id', { templateUrl: '/share.html', controller: 'ShareController' })
    .when('/localLoad/:path*', { templateUrl: '/share.html', controller: 'LocalLaunchController' })
    .otherwise({ redirectTo: '/' });
});
