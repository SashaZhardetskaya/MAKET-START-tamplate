var gulp = require('gulp');
var rigger = require('gulp-rigger');
var rimraf = require('gulp-rimraf');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'front-end/',
        js: 'front-end/js/',
        style: 'front-end/css/',
        img: 'front-end/img/',
        fonts: 'front-end/fonts/',
        all: 'front-end/**/*.*'
    },
    src: { //Пути откуда брать исходники
        html: 'src/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        all: 'src/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.*',
        js: 'src/**/*.*',
        style: 'src/**/*.*',
        img: 'src/**/*.*',
        fonts: 'src/**/*.*'
    },
    clean: './front-end'
};

var config = {
    server: {
        baseDir: "front-end"
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "front-end"
};

gulp.task('build:html', function () {
    gulp.src(path.src.html)
        .pipe(rigger().on('error', function (error) {
            console.log(error);
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('build:css', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', function(error){
            console.log(error);
        }))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({stream: true}));
});

gulp.task('build:js', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('build:img', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('build:fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('clean', function() {
    return gulp.src(path.clean, { read: false })
        .pipe(rimraf({ force: true }));
});

gulp.task('build', [
    'build:html',
    'build:js',
    'build:css',
    'build:fonts',
    'build:img'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('build:html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('build:css');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('build:js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('build:img');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('build:fonts');
    });
});
gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);