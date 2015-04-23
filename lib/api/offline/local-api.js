var Service = require('api-service');

var apiService = new Service('http://localhost:8000');

apiService.add('challenge.save', {
    method : 'post',
    route  : '/challenge/local/:filename',
    params : [ 'filename', 'description', 'code', 'image' ]
});

apiService.add('challenge.saveWallpaper', {
    method : 'post',
    route  : '/challenge/local/wallpaper/:filename',
    params : [ 'filename', 'image_1024', 'image_4_3', 'image_16_9' ]
});

apiService.add('challenge.load', {
    method : 'get',
    route  : '/challenge/web'
});

apiService.add('challenge.share', {
    method : 'post',
    route  : '/challenge/web/:filename',
    params : [ 'filename', 'description', 'code', 'image' ]
});

apiService.add('challenge.localLoad', {
    method : 'get',
    route  : '/challenge/local/:path',
    params : ['filename']
});

apiService.add('progress.load', {
    method : 'get',
    route  : '/progress'
});

apiService.add('progress.save', {
    method : 'post',
    route  : '/progress/:progress'
});

apiService.add('server.shutdown', {
    method : 'post',
    route  : '/shutdown'
});

module.exports = apiService;
