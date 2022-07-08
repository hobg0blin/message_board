// including plugins
const gulp = require('gulp')
const minifyCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const gp_concat = require('gulp-concat')
const gp_rename = require('gulp-rename')
// const gp_uglify = require('gulp-uglify')
// const clean = require('gulp-clean')
// const to5 = require('gulp-6to5')
// const path = require('path')

// Add CSS files
gulp.task('css', function(){
    return gulp.src(
            [
                './public/css/inter-ui.css',
                './public/css/font-awesome.min.css',
                './public/css/default.css',
                './public/css/aos.css',
                './public/css/custom.css'
            ]
        )
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gp_concat('style.min.css'))
        .pipe(gulp.dest('./public/dist/css/'))
})

// When using a theme, usuually there is a fonts
// directory that should be copied to dist
gulp.task('copy-fonts', function(){
    return gulp.src(
            [
                './public/fonts/**'
            ]
        )
        .pipe(gulp.dest('./public/dist/fonts/'))
})

gulp.task('style', ['css', 'copy-fonts'], function(){})

// Add javascript files here
gulp.task('vendor', function(){
    return gulp.src(
            [
                './public/js/compiled.js'
            ]
        )
        .pipe(gp_rename('vendor.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
});


gulp.task('js', ['vendor'], function(){})

gulp.task('prod', ['style', 'js'], function(){})
gulp.task('default', ['style', 'js'], function(){})
