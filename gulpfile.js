// gulp的配置文件
const {task,src,dest,watch,series,parallel} = require('gulp');
const load = require('gulp-load-plugins')();//批量加载gulp插件
const del = require('del');

task('del', async ()=>{
    await del(['./dist']);//删除原来的dist目录
})

//sass
task('sass',async ()=>{
    src('./src/sass/*.scss')
    .pipe(load.sass())// 把sass编译成css
    .pipe(load.concat('main.css'))//合并文件
    .pipe(load.minifyCss())//压缩css
    .pipe(dest('./dist/css'))//写入dist目录下
    .pipe(load.connect.reload())
})


// 处理js文件
task('js',async ()=>{
    src(['./src/js/*.js'])//读取文件
    .pipe(load.babel({presets: ['@babel/preset-env']}))// 转成es5
    .pipe(load.concat('main.js'))//合并文件
    .pipe(load.uglify())//压缩js
    .pipe(dest('./dist/js'))//写入dist目录下
    .pipe(load.connect.reload())
})

// 处理html
task('html',async ()=>{
    src('./src/html/*.html')//读取文件
    .pipe(load.minifyHtml())//压缩html
    .pipe(dest('./dist/html'))//写入dist目录下
    .pipe(load.connect.reload())
})
task('php',async ()=>{
    src('./src/php/*.php')//读取文件
    .pipe(dest('./dist/php'))//写入dist目录下
    .pipe(load.connect.reload())
})

// 处理图片
task('img', async ()=>{
    src('./src/img/*.*')
    .pipe(dest('./dist/img'))
    .pipe(load.connect.reload())
})

// 启动web服务器，开启自动刷新
task('connect',async ()=>{
    load.connect.server({
        root: './dist',// 设置根目录
        livereload: true// 开启自动刷新
    });
})

// 监听文件变化，重新合并文件
task('watch',async ()=>{
    watch(['./src/html/*.html'],series('html'));
    watch(['./src/sass/*.scss'],series('sass'));
    // watch(['./src/css/*.css'],series('css'));
    watch(['./src/js/*.js'],series('js'));
    watch(['./src/php/*.php'],series('php'));
    watch(['./src/imgs/*.*'],series('img'));
})

// 启动服务，开始监听
task('default',series('connect','watch'));

// 构建项目
task('build',series('del',parallel('html','js','php','sass','img')));
