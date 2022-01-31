import gulp from "gulp";
import del from "delete";
import bs from "browser-sync";
import sourcemaps from "gulp-sourcemaps";
import autoPrefixer from "gulp-autoprefixer";
import gulpIf from "gulp-if";
import cleanCSS from "gulp-clean-css";
import cssStylus from "gulp-stylus";

const browserSync = bs.create();
let series = gulp.series;
let parallel = gulp.parallel;
let src = gulp.src;
let dest = gulp.dest;
let watch = gulp.watch;

const paths = {
	build: {
		styles: "build/../../src/css/",
		server: "build/server/",
	},
	src: {
		styles: "src/styles/*.styl",
		server: "src/server/**/*.js",
	},
	watch: {
		styles: "src/styles/**/*.styl",
		server: "src/server/**/*.js",
	},
};

let param = (name) => {
	return process.argv.indexOf(`--${name}`) >= 0;
};

let clean = (done) => {
	return del(["build"], done);
};

let css = () => {
	return src(paths.src.styles)
		.pipe(gulpIf(param("prod"), sourcemaps.init()))
		.pipe(autoPrefixer())
		.pipe(cssStylus())
		.pipe(gulpIf(param("prod"), cleanCSS({ compatibility: "ie11" })))
		.pipe(gulpIf(param("prod"), sourcemaps.write(".")))
		.pipe(dest(paths.build.styles));
};

let server = (done) => {
	return src(paths.src.server).pipe(dest(paths.build.server));
};

let serve = (done) => {
	browserSync.init({
		https: false,
		open: false,
		notify: false,
		reloadDelay: 300,
		ghostMode: false,
		injectChanges: true,
		server: {
			baseDir: "./build",
		},
		middleware: [],
		port: 8080,
	});

	done();
};

let reload = (done) => {
	browserSync.reload();
	done();
};

let watchFiles = (done) => {
	watch(paths.watch.styles, css);
	watch(paths.watch.server, series(server, reload));
	done();
};

export { watchFiles as ObserveFile };
export const build = series(clean, parallel(css));
export default series(clean, parallel(css), watchFiles, serve);
