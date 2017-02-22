var env             = require('minimist')(process.argv.slice(2)),
    gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    plumber         = require('gulp-plumber'),
    jade            = require('gulp-jade'),
    browserify      = require('gulp-browserify'),
    browserSync     = require('browser-sync'),
    gulpif          = require('gulp-if'),
    stylus          = require('gulp-stylus'),
    csso            = require('gulp-csso');
    concat          = require('gulp-concat'),
    jeet            = require('jeet'),
    rupture         = require('rupture'),
    prefixer        = require('autoprefixer-stylus'),
    imagemin        = require('gulp-imagemin'),
    cache           = require('gulp-cache'),
    spritesmith     = require('gulp.spritesmith'),
    px2rem          = require('gulp-px2rem'),
    postcss         = require('gulp-postcss'),
    pxtorem         = require('postcss-pxtorem'),
    autoprefixer    = require('autoprefixer'),
    rsync           = require('rsyncwrapper');

//pcss
gulp.task('pcss', function () {
    var processors = [
        autoprefixer({
            browsers: 'last 1 version'
        }),
        pxtorem({
            replace: false
        })
    ];
    return gulp.src(['app/dist/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('app/dist/css'));
});

// Компиляция Jade
gulp.task('jade', function () {
    return gulp.src('app/src/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({pretty: !env.p}))
        .pipe(gulp.dest('app/dist/'));
});

// Компиляция Stylus
gulp.task('stylus', function(){
    return gulp.src('app/src/stylus/**/*.styl')
        .pipe(stylus({
          'include css': true,
          use: [jeet()],
    }))
        .pipe(gulp.dest('app/dist/css/'))
});

gulp.task('rem', function() {
    gulp.src('app/dist/css/*.css')
        .pipe(px2rem())
        .pipe(gulp.dest('app/dist/css/'));
});

//Минификация стилей
gulp.task('csso', function () {
    return gulp.src('app/dist/css/*.css')
        .pipe(csso())
        .pipe(gulp.dest('app/dist/css/min'));
});


gulp.task('copy', function() {
    return gulp.src(['app/src/*.html', 'app/src/*.txt'])
        .pipe(gulp.dest('app/dist/'))
});
//Проброс шрифтов
gulp.task('font', function() {
    gulp.src(['app/src/fonts/*.ttf', 'app/src/fonts/*.woff', 'app/src/fonts/*.woff2' ])
        .pipe(gulp.dest('app/dist/fonts'));
});

// Конкатинация JS
gulp.task('js', function () {
    return gulp.src('app/src/js/**/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/dist/js'));
});

// Конкатинация вендорных файлов
gulp.task('vendors', function () {
    return gulp.src('app/src/vendors/**/*.js')
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('app/dist/vendors'));
});



// Сжатие изображений
gulp.task('imagemin', function () {
    return gulp.src('app/src/img/**/*')
        .pipe(plumber())
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('app/dist/img'));
});

//Создание спрайтов
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/src/img/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.styl',
        cssFormat: 'stylus',
        algorithm: 'binary-tree'
  }));
    spriteData.img.pipe(gulp.dest('app/dist/img/sprite'));
    spriteData.css.pipe(gulp.dest('app/src/img/sprite'));
});

gulp.task('watch', function () {
    gulp.watch('app/src/jade/**/*.jade', ['jade']);
    gulp.watch('app/src/stylus/**/*.styl', ['stylus']);
    gulp.watch('app/src/js/**/*.js', ['js']);
    gulp.watch('app/src/img/**/*.{jpg,jpeg,png,gif}', ['imagemin']);
});

gulp.task('browser-sync', function () {
    var files = [
       'app/dist/**/*.html',
       'app/dist/css/**/*.css',
       'app/dist/img/**/*',
       'app/dist/js/**/*.js',
    ];

    browserSync.init(files, {
        server: {
            baseDir: 'app/dist/',
        },
    });
});

// Деплой
gulp.task('deploy', function () {
    rsync({
        ssh: true,
        src: './app/dist/',
        dest: 'user@hostname:/path/to/www',
        recursive: true,
        syncDest: true,
        args: ['--verbose'],
    },
        function (erro, stdout, stderr, cmd) {
            gutil.log(stdout);
        });
});

// Дев
gulp.task('default', [(env.fy) ? 'browserify' : 'jade', 'copy', 'font', 'vendors', 'sprite', 'watch', 'browser-sync']);

// Боевая сборка
gulp.task('build', [(env.fy) ? 'browserify' : 'jade', 'copy','font', 'vendors', 'imagemin', 'csso', 'deploy']);