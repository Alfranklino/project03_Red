const gulp = require("gulp");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");

// gulp.task("default", function(done){
//     console.log("Hello World");
//     done();
// });

gulp.task("scripts", function () {
    return gulp
        .src("./js/app.js")
        .pipe(terser())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest("./build/js"))
        .pipe(browserSync.stream());
});

gulp.task("eslint", function(){
    return gulp
    .src("./js/app.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', function() {
    return gulp
    .src('./css/style.scss')
    .pipe(sass())
    .pipe(
        autoprefixer({
            browsers: ['last 2 versions']
        })
    )
    
    .pipe(gulp.dest('./css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    })

    gulp.watch("js/app.js", gulp.series(["scripts", "eslint"]));
    gulp.watch('./css/*.scss', gulp.series("sass"));
    gulp.watch("./*.html").on("change", browserSync.reload);
});



gulp.task("default", gulp.parallel("watch"));