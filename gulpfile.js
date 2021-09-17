"use strict";

const {src, dest, parallel, watch} = pkg;
import pkg from 'gulp';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import minify from 'gulp-minify';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import del from 'del';

const bs = () => {
   browserSync.init ({
   server: {baseDir: 'app/'},
   notify: false,
   online: true
   })
};

const styles = () => {
   return src('app/scss/style.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(concat('style.min.css'))
   .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
   .pipe(dest('app/css/'))
   .pipe(browserSync.stream())
};

const scripts = () => {
   return src('app/js/script.js',)
   .pipe(plumber())
	.pipe(concat('script.js'))
   .pipe(minify())
   .pipe(dest('dist/js'))
   .pipe(browserSync.stream())
};

const images = () => {
   return src('app/img/src/**/*')
   .pipe(newer('app/img/dest/'))
   .pipe(imagemin())
   .pipe(dest('app/img/dest/'))
};

const cleanImg = () => {
	return del('app/img/dest/**/*', { force: true }) 
};

const build = () => {
	return src([
      'app/css/**/*.min.css',
      'app/js/**/*.js',
      'app/img/dest/**/*',
      'app/**/*.html'
	], {base: 'app'})
   .pipe(dest('dist'))
};
const cleanBuild =() => {
   return del('dist/**/*', { force: true }) 
};

const startWatch = () => {
   watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
   watch(['app/**/*.scss'], styles);
   watch('app/**/*.html').on('change', browserSync.reload);
   watch('app/img/src/**/*', images);
};


export {cleanBuild, bs, styles, images, scripts, startWatch, cleanImg, build };
export default parallel( startWatch, scripts, bs, styles);