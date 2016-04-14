由于这段时间已经是变成了markdown重度使用者了，因此就想着自己折腾一个markdown编辑器，发布在github pages上面。这样就可以实现了一个在线markdown编辑器。
# 技术栈
* AngularJS：这个就不用过多介绍了；
* marked.js（https://github.com/chjj/marked）： 将markdown代码编译成HTML的插件；
* highlight.js：代码高亮插件
# 实现的目标
* 在线编辑markdown，实时生成预览
* 实现语法高亮显示（未完成）
* 实现黑色主题（未完成）
* 实现下载markdown文件和HTML文件（未完成）
* gulp构建网站发布到git-pages
# 实现原理
编译markdown代码，我选择`marked.js`， 当然你也可以选择其他插件，也是一样能将markdown代码编译成HTML。
由于AngularJS双向绑定的机制，因此可以非常方便得实现了实时生成预览。话不多说，用代码来讲解整个过程。
## 界面实现
参照现有的在线markdown编辑器，大多数采用的都是左右分栏的布局，左边是编辑器，右边是预览区。因此我也采用了这样的布局模式。
![](http://7xr6yj.com1.z0.glb.clouddn.com/angular-markdown-1.png)
此外，还需要对右边预览区添加必要的CSS样式，比如`h1`~`h6`元素样式的定义、代码样式`pre`  `code`的定义等。
```css
h1, h2, h3, h4, h5, h6 {
    font-family: 'Old Standard TT', serif;
    font-weight: bold;
    border-bottom: 1px solid #eee;
}

h3 {
    border-bottom: 1px solid #ddd;
}
pre {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    background-color: #f8f8f8;
    border: 1px solid #dfdfdf;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    padding: 0.125rem 0.3125rem 0.0625rem;
}

pre code {
    background-color: transparent;
    border: 0;
    padding: 0;
}
```
## markdown实时预览
给左边的`textarea`绑定一个`ng-model`，这样就可以实时获取到输入的值，并且可以实时显示在右边的预览区。如下面代码：
```html
<div ng-controller="EditorController as vm">
    <h3 class="title">基于angular的markdown编辑器</h3>
    <div class="container" >
    <textarea id="editor" ng-model="vm.editor"></textarea>
        <div id="preview" >{{vm.editor}}</div>
    </div>
</div>
```
这样就可以实现左边的编辑器和右边的预览区实时同步了。那么接下来我们还需要做的就是将预览区的markdown代码编译成HTML代码。由于需要实时监听左边的输入框，因此我们可以在预览区的变量中添加一个过滤器：
```html
<div id="preview" >{{vm.editor  | render}}</div>
```
在过滤器`render`中，我们调用`marked.js`将输入的markdown代码转换为html代码。`marked.js`的使用也非常简单，`marked.js`会启用下面的默认配置（所以不需要你再手动配置）
```javascirpt
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});
document.getElementById('content').innerHTML =
      marked('# Marked in browser\n\nRendered by **marked**.');  //在浏览器中可以这么使用
```
因此我们就可以这么在过滤器中调用`marked.js`的方法，如下面
```javascirpt
    .filter('render', [ function () {
            return function (input) {
                if (input.length != 0) {
                    input = marked(input);
                }
                return input;
            }
        }])
```
那么到这里是不是就可以将markdown代码编译成HTML代码了呢？当然不是的。会出现下面的这种情况，显示出HTML代码：
![](http://7xr6yj.com1.z0.glb.clouddn.com/angular.gif)
由于`marked`方法返回的是HTML代码，而在AngularJS中，出于安全考虑，会转义发现的任何HTML内容以阻止HTML注入攻击。因此如果要正常显示的话，需要对HTML进行处理。这样采用AngularJS自带的`$sce`服务：
```javascript
    .filter('render', ['$sce', function ($sce) {    //依赖注入$sce
            return function (input) {
                if (input.length != 0) {
                    input = marked(input);
                }
                return $sce.trustAsHtml(input);    //返回值用trustAsHtml()处理
            }
        }])
```
同时，HTML中也需要更改：
```html
<div id="preview" ng-bind-html="vm.editor | render"></div>    //使用指令ng-bind-html来绑定变量
```
到这里，一个markdown编辑器就打造完成了。来看看效果吧！
![](http://7xr6yj.com1.z0.glb.clouddn.com/angular-markdown.gif)
也可以点击[在线演示](http://superman66.github.io/angular-markdown/app/#/editor)，查看效果。
项目github地址：https://github.com/superman66/angular-markdown
# 总结：
实现起来比较简单，主要是利用了` marked.js`插件。
## 待优化
* 还需要添加代码高亮的优化
* 支持以`md`格式和`html`格保存文件到本地

