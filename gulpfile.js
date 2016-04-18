/**
 * Created by superman on 2015/9/26.
 */
/*
 npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css  gulp-concat-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload tiny-lr gulp-cache del gulp-imageisux gulp-rev gulp-rev-collector --save-dev

 前端构建流程
 1、clean  dist 文件夹
 2、clean index-build.html
 3、打包压缩 css js 图片
 4、rename 把index-template.html rename 成 index-build.html后 dest到当前目录
 5、执行rev 替换文件名
 */


var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concatcss = require('gulp-concat-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    tinylr = require('tiny-lr'),               //livereload
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    server = tinylr(),
    port = 63342,
    livereload = require('gulp-livereload'),
    del = require('del');

var app_paths = {
    index_template: 'app/index-template.html',
    index_build: 'app/index.html',
    src: '',
    dist: 'app/dist'
};
//合并自定义js文件
gulp.task('app-js', function (cb) {
    // app customer js
    var jsArr = [
        'app/app.js',
        'app/views/**/*.js'
    ];
    return gulp.src(jsArr)
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(app_paths.dist + '/js'))
        .pipe(livereload(server))
        .pipe(rev())
        .pipe(gulp.dest(app_paths.dist + '/js'))
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(app_paths.dist + '/js'))
        .pipe(notify({message: 'Scripts task complete'}));
    cb(err);
});
// 更新引入JS版本
gulp.task('app-revJs', ['app-js', 'app-rename'], function () {
    gulp.src([app_paths.dist + '/js/*.json', app_paths.index_build])        //- 读取 rev-manifest.json 文件以及需要进行js替换的文件
        .pipe(revCollector())                                   //- 执行文件内js名的替换
        .pipe(gulp.dest('app/'))                                //- 替换后的文件输出的目录
        .pipe(notify({message: 'revJs task complete'}));
});

// 合并Lib js文件
gulp.task('app-lib', ['app-css'], function (cb) {
    var libArr = [
        'node_modules/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'node_modules/marked/marked.min.js',
        'node_modules/highlight.js/lib/highlight.js',
        'bower_components/angular-highlightjs/angular-highlightjs.min.js',
        'node_modules/ngstorage/ngStorage.min.js',
        'node_modules/angular-animate/angular-animate.min.js'
    ];
    return gulp.src(libArr)
        .pipe(concat('lib.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(app_paths.dist + '/lib'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(app_paths.dist + '/lib'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(app_paths.dist + '/lib'))
        .pipe(notify({message: 'Lib Scripts task complete'}));
    cb(err);
});

// 更新引入JS版本
gulp.task('app-revLib', ['app-lib', 'app-rename'], function () {
    gulp.src([app_paths.dist + '/lib/*.json', app_paths.index_build])        //- 读取 rev-manifest.json 文件以及需要进行js替换的文件
        .pipe(revCollector())                                   //- 执行文件内js名的替换
        .pipe(gulp.dest('app/'))                                //- 替换后的文件输出的目录
        .pipe(notify({message: 'revLib task complete'}));

});
//压缩/合gu并/CSS 生成版本号
gulp.task('app-css', function (cb) {
    return gulp.src([                                        //- 需要处理的css文件，放到一个字符串数组里
            'bower_components/html5-boilerplate/dist/css/normalize.css',
            'bower_components/html5-boilerplate/dist/css/main.css',
            'node_modules/highlight.js/styles/atelier-cave-light.css',
            'app/app.css',
            'app/static/**/*.css'
        ])
        .pipe(concatcss('main.css'))                        //合并CSS
        .pipe(minifycss())                                      //压缩CSS
        .pipe(rename({suffix: '.min'}))                         //- 重命名，添加后缀名
        .pipe(gulp.dest(app_paths.dist + '/css'))
        .pipe(rev())                                             //- 为文件添加MD5后缀
        .pipe(gulp.dest(app_paths.dist + '/css'))
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(app_paths.dist + '/css'))
        .pipe(notify({message: 'CSS task complete'}));
    cb(err);
});


// 更新引入CSS版本
gulp.task('app-revCss', ['app-css', 'app-rename'], function () {
    gulp.src([app_paths.dist + '/css/*.json', app_paths.index_build])        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('app/'))                                //- 替换后的文件输出的目录
        .pipe(notify({message: 'revCSS task complete'}));
    console.log('app-revCss:' + new Date());
});

//压缩图片
gulp.task('app-images', function () {
    return gulp.src([
            'app/statics/web/images/**/*.png',
            'app/statics/web/images/**/*.jpg'
        ])
        /*.pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
         .pipe(livereload(server))*/
        .pipe(gulp.dest(app_paths.dist + '/images'))
        .pipe(notify({message: 'Images task complete'}));
});
//清除缓存文件
gulp.task('app-clean', function (cb) {
    del([app_paths.dist + '/js', app_paths.dist + '/css', app_paths.dist + '/lib'], cb)
});

gulp.task('app-cleanIndex', function (cb) {// 清除index-bulid.html
    del(app_paths.index_build, cb)
});

gulp.task('app-default', function () {
    gulp.start('app-css', 'app-js', 'app-lib'); // start 执行任务的顺序是不确定的
});

gulp.task('app-rev', function () {
    gulp.start('app-revCss', 'app-revJs', 'app-revLib');
});

//重命名index-template.html文件
gulp.task('app-rename', function () {
    var stream = gulp.src(app_paths.index_template)
        .pipe(rename({
            basename: "index",
            suffix: "",
            extname: ".html"
        }))
        .pipe(gulp.dest('app/'))
        .pipe(notify({message: 'rename task complete'}));
    console.log('app-rename:' + new Date());
    return stream;
});




/*bulid task*/
gulp.task('mobile-build', ['mobile-clean', 'mobile-cleanIndex', 'mobile-images', 'mobile-css', 'mobile-js', 'mobile-lib', 'mobile-rename', 'mobile-revCss', 'mobile-revJs', 'mobile-revLib']);

gulp.task('app-build', ['app-clean', 'app-cleanIndex',  'app-css', 'app-js', 'app-lib', 'app-rename', 'app-revCss', 'app-revJs', 'app-revLib']);

gulp.task('default', function () {
    gulp.start('app-build', 'mobile-build');
});


//app
gulp.task('js', function (cb) {
    //  customer js
    var jsArr = [
        'mobile/app.js'
    ];
    return gulp.src(jsArr)
        .pipe(concat('app-dev.js'))
        .pipe(uglify())             //压缩js
        .pipe(gulp.dest('app'))
        .pipe(notify({message: 'Scripts task complete'}));
    cb(err);
});