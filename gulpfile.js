const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

let paths = {
    html: {
        src: './dev/index.html',
        dest: './public'
    },
    styles: {
        src: './dev/scss/style.scss',
        dest: './public/css',
        watch: './dev/scss/**/*.scss'
    }
}

// copies html from dev to public dir
gulp.task('html', function() {
    gulp.src(paths.html.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
});

// procees sass to css
gulp.task('styles', function() {
    gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
});

// watches for changes in files
function watch() {
    gulp.watch(paths.html.src, ['html']).on('change', browserSync.reload),
    gulp.watch(paths.styles.watch, ['styles']).on('change',
    browserSync.reload);
}

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './public'
        }
    });

    watch();
});

gulp.task('default', ['html', 'styles', 'serve']);