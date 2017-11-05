var gulp = require('gulp'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    server = require('gulp-webserver'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant');

var sourcePath = './src',
    publicPath = './public';


// pug ---------------------------------------------
gulp.task('pug', function() {
    gulp.src(sourcePath + '/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({pretty: '    '}))
    .pipe(gulp.dest(publicPath));
});


// js ---------------------------------------------
gulp.task('js', function() {
    gulp.src(sourcePath + '/js/**/*.js')
    .pipe(plumber())
    // .pipe(uglify())
    .pipe(gulp.dest(publicPath + '/js/'));
});


// scss ---------------------------------------------
var supportBrowser = ['> 1% in JP'],
    postcssPlugins = [
        // require('doiuse')(supportBrowser),
        require('autoprefixer')(supportBrowser),
        require('postcss-sorting')
    ];

gulp.task('scss', function() {
    gulp.src(sourcePath + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(publicPath + '/css/'));
});


// imagemin ---------------------------------------------
gulp.task('imagemin', function() {
    gulp.run('imagemin-jpg');
    gulp.run('imagemin-png');
});


gulp.task('imagemin-jpg', function() {
    // jpg, gif, svg, ico
    gulp.src(sourcePath + '/images/**/*.+(jpg|gif|svg|ico)')
    .pipe(imagemin({
        optimizationLevel: 7
    }))
    .pipe(gulp.dest(publicPath + '/images/'));
});


gulp.task('imagemin-png', function() {
    // png
    gulp.src(sourcePath + '/images/**/*.png')
   .pipe(imagemin(
       [imageminPngquant({
           quality: '70-95',
           speed: 4
        })]
    ))
    .pipe(imagemin())
    .pipe(gulp.dest(publicPath + '/images/'));
});


// webserver ---------------------------------------------
gulp.task('webserver', function() {
    gulp.src(publicPath)
    .pipe(server({
        livereload: true,
        open: true
    }));
});


// watch ---------------------------------------------
gulp.task('watch', function() {
    gulp.watch([
        sourcePath + '/pug/**/*.pug',
        sourcePath + '/js/**/*.js',
        sourcePath + '/scss/**/*.scss'
    ],
    [
        'pug',
        'js',
        'scss'
    ]);
});


// default ---------------------------------------------
gulp.task('default', ['webserver', 'watch']);
