let gulp = require('gulp'); //Модуль Галпа
let concat = require('gulp-concat'); //Модуль Конкатинации строк 
let autoprefixer = require('gulp-autoprefixer'); //Модуль автоматическог опрефикса к файлам 
let cleanCSS = require('gulp-clean-css'); // Модуль сжатия CSS файла
let uglify = require('gulp-uglify'); // Модуль сжатия CSS файла
let rename = require('gulp-rename'); // Модуль Переименования файла
let del = require('del'); // Модуль удаления файлов
let sass = require('gulp-sass'); // Модуль SASS
let sourcemaps = require('gulp-sourcemaps'); //Модуль Sourcemaps
let browserSync = require('browser-sync').create(); //Модуль browser-sync

//Порядок подключения CSS файлов
let cssFiles = [
    './src/sass/**/*.sass'
]

//Порядок подключения JS файлов
let jsFiles = [
    './src/js/lib.js',
    './src/js/main.js',
]

//Таск на стили CSS
function styles() {
    //Шаблон для поиска файлов CSS
    //Все файлы по шаблону './src/sass/*.sass'
    return gulp.src(cssFiles)

    .pipe(sourcemaps.init())
    
    //Преобразования SASS файлов
    .pipe(sass({
        errLogToConsole: true,
        // outputStyle: 'compressed'
    }))

    //Ошибка в консоль
    .on('error', console.error.bind('erorr'))

    //Добавления префикса к файлу
    .pipe(autoprefixer( {
        override: ['last 2 version'],
        cascade: false
    }))

    //Выходная папка для стилей в src
    .pipe(gulp.dest('./src/css'))


    //Объединения файлов в один 
    .pipe(concat('style.css'))


    //Добавления суфикса
    .pipe(rename({ suffix: '.min' }))

    //Чтения Sourcemaps
    .pipe(sourcemaps.write('./'))

    //Сжимает CSS файл
    .pipe(cleanCSS({
        level: 2
    }))
    
    //Выходная папка для стилей в build
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());


}

//Таск на скрипты JS
function scripts() {

    //Шаблон для поиска файлов JS
    //Все файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)

    //Объединения файлов в один 
    .pipe(concat('script.js'))
    
    //Сжатия JS файла
    .pipe( uglify( {
        toplevel: true
    }) )

    //Добавления суфикса
    .pipe(rename({ suffix: '.min' }))

    //Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());


}

//Удалить всё в указаной папке 
function clean() {

    return del(['build/*'])
}

//Просматривания файлов

function watch() {
    browserSync.init( {
        server: {
            baseDir: "./"
        }
    });


    //Следим за SASS файлами
    gulp.watch('./src/sass/**/*.sass', styles);

    //Следим за JS файлами
    gulp.watch('./src/js/**/*.js', scripts); 

    //При изменеии HTML запустить синхронизацию 
    gulp.watch('./*.html').on('change', browserSync.reload); 
}


//Таск вызывающий функцию styles
gulp.task('styles', styles);

//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);

//Таск вызывающий функцию clean
gulp.task('del', clean);

//Таск для отслеживания изменений 
gulp.task('watch', watch);  

//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));

//Таск запускает таск build и watch  последовательно 
gulp.task('dev', gulp.series('build','watch'));