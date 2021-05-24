/* Gulp - система потоковой сборки */

// создаем файл gulpfile.js и подключаем в нем необходимые модули
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(), // обновление страницы во время добавления изменений
    sass = require('gulp-sass'), // подключение Sass
    prefixer = require('gulp-autoprefixer'), // автоматически ставить нужные префиксы в CSS
    cssmin = require('gulp-clean-css'), // минификация CSS файла
    uglify = require('gulp-uglify'), // сжимать JS
    fileinclude = require('gulp-file-include'), // соединять все HTML-файлы в один. Также он соединяет JS-файлы
    gcmq = require('gulp-group-css-media-queries'), // объединять медиа-запросы
    htmlmin = require('gulp-htmlmin'), // минификация html файла
    del = require('del'); // очистить указанную папку

gulp.task('clean', function (done) {
    del.sync('build'); // удаляем папку build перед сборкой
    done();
});

gulp.task('html_build', function (done) {
    gulp.src('src/*.html') // обращаемся ко всем html файлам в папке src и ко всем вложенным папкам внутри src
        .pipe(fileinclude()) // объединить все html файлы в один
        .pipe(htmlmin({
            collapseWhitespace: true
        })) // минификация html + collapseWhitespace - убрать пробелы
        .pipe(gulp.dest('build/')) // папка для рендеринга
        .pipe(browserSync.stream()); // обновление страницы
    done(); // задача выполнена
});

gulp.task('css_build', function (done) {
    gulp.src('src/styles/style.scss')
        .pipe(sass())
        .pipe(prefixer())
        .pipe(gcmq())
        .pipe(cssmin()) // Минификация CSS файла
        .pipe(gulp.dest('build/styles/'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('js_build', function (done) {
    gulp.src('src/js/script.js')
        .pipe(fileinclude()) // объединить в один js файл
        .pipe(uglify()) // сжать JS
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('img_build', function (done) {
    gulp.src('src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}')
        .pipe(gulp.dest('build/img/'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('fonts_build', function (done) {
    gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('webServer', function () { // перезагрузка сервера
    browserSync.init({ // обновление будет происходить в инициализируемой папке
        server: "build/",
        port: 3000,
        notify: false
    });
    gulp.watch('src/**/*.html', gulp.series('html_build')); // watch смотрит за указанной задаче, а series запускает задачи (по порядку)
    gulp.watch('src/**/*.scss', gulp.series('css_build'));
    gulp.watch('src/**/*.js', gulp.series('js_build'));
    gulp.watch('src/**/*.{jpg, png, svg, gif, ico, webp}', gulp.series('img_build'));
    gulp.watch('src/fonts/*.*', gulp.series('fonts_build'));
});

/* Когда в TERMINAL прописывается "gulp", то вызывается задача с callback "default" 
В строке gulp.series('...') указано, что именно нужно выполнять. В данном случае по дефолту
нужно выполнять все перечисленные задачи (по порядку). */
gulp.task('default', gulp.series('clean', 'html_build', 'css_build', 'js_build', 'img_build', 'fonts_build', 'webServer'));