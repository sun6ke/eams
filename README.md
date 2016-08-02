## Intro

eams-ui 项目，基于bootstrap以及一系列其他组件，组件清单：

1. "jquery": ">= 1.9.1 < 2.0.0",
1. "fontawesome": "~4.3.0",
1. "bootstrap": "~3.3.4",
1. "html5shiv": "~3.7.2",
1. "respond": "~1.4.2",
1. "bootstrap-switch": "~3.3.2",
1. "weather-icons": "~1.3.2",
1. "jquery-steps": "~1.1.0",
1. "tooltipster": "~3.3.0",
1. "quicksearch": "~2.0.5",
1. "jquery-validation": "~1.13.1",
1. "jquery-maskedinput": "~1.4.1",
1. "moment": "~2.10.3",
1. "es5-shim": "~4.1.1",
1. "eonasdan-bootstrap-datetimepicker": "~4.7.14",
1. "mjolnic-bootstrap-colorpicker": "~2.1.1"

## 目录结构

```bash
eams-ui-dist
  ├── dist
  |   ├── css
  |   ├── fonts
  |   ├── img
  |   └── js
  └── docs
```

* js、css、img、fonts都在``dist``
* 样例文档在``docs``

## 如何使用

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
  <title>Title</title>

  <!-- eams-ui -->
  <link href="@{path-to-eams-ui-dist}/css/eams-ui.min.css" rel="stylesheet">

  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="@{path-to-eams-ui-dist}/js/html5shiv.min.js"></script>
  <script src="@{path-to-eams-ui-dist}/js/respond.min.js"></script>
  <![endif]-->
</head>

<body>

<!-- 内容写在这里 -->

<script src="@{path-to-eams-ui-dist}/js/eams-ui.min.js"></script>
<!-- 国际化文件 -->
<!-- <script src="dist/js/eams-ui.en.min.js"></script> -->
<script src="@{path-to-eams-ui-dist}/js/eams-ui.zh.min.js"></script>
<!-- 自适应iframe高度 -->
<script src="@{path-to-eams-ui-dist}/js/eams-ui-iframe-auto-height.min.js"></script>
</body>

</html>
```
