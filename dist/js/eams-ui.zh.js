/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
	required: "必须填写",
	remote: "请修正此栏位",
	email: "请输入有效的电子邮件",
	url: "请输入有效的网址",
	date: "请输入有效的日期",
	dateISO: "请输入有效的日期 (YYYY-MM-DD)",
	number: "请输入正确的数字",
	digits: "只可输入数字",
	creditcard: "请输入有效的信用卡号码",
	equalTo: "你的输入不相同",
	extension: "请输入有效的后缀",
	maxlength: $.validator.format("最多 {0} 个字"),
	minlength: $.validator.format("最少 {0} 个字"),
	rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之間的字串"),
	range: $.validator.format("请输入 {0} 至 {1} 之间的数值"),
	max: $.validator.format("请输入不大于 {0} 的数值"),
	min: $.validator.format("请输入不小于 {0} 的数值")
});

// 这里放所有定制的validate中文消息
$.extend($.validator.messages, {
  assert: "断言失败"
});
$.extend($.validator.messages, {
  require_from_group: "请在这些域中至少输入{0}个"
});
$.extend($.validator.messages, {
  integer: "请输入整数",
  posInteger: "请输入大于0的整数",
  posNumber: "请输入大于0的数字",
  zeroOrPosInteger: "请输入大于或等于0的整数",
  zeroOrPosNumber: "请输入大于或等于0的数字"
});

//! moment.js locale configuration
//! locale : chinese (zh-cn)
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var zh_cn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'Ah点mm分',
            LTS : 'Ah点m分s秒',
            L : 'YYYY-MM-DD',
            LL : 'YYYY年MMMD日',
            LLL : 'YYYY年MMMD日Ah点mm分',
            LLLL : 'YYYY年MMMD日ddddAh点mm分',
            l : 'YYYY-MM-DD',
            ll : 'YYYY年MMMD日',
            lll : 'YYYY年MMMD日Ah点mm分',
            llll : 'YYYY年MMMD日ddddAh点mm分'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay : function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay : function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse : 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return zh_cn;

}));
/*
 * Bootstrap Datetimepicker
 */
$.fn.datetimepicker.defaults.locale = 'zh-cn';

/*!
 * Bootstrap-select v1.7.7 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: '没有选中任何项',
    noneResultsText: '没有找到匹配项',
    countSelectedText: '选中{1}中的{0}项',
    maxOptionsText: ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'],
    multipleSeparator: ', '
  };
})(jQuery);


}));

/*
 * Bootstrap Datetimepicker
 */

+function ($) {

  FormUtil.locales['zh-CN'] = {

    single_select: '请仅选择一项',
    mutil_select: '请选择一项或者多选',

  }

}(jQuery);

/*!
 * FileInput Chinese Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 * @author kangqf <kangqingfei@gmail.com>
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */
(function ($) {
  "use strict";

  $.fn.fileinputLocales['zh'] = {
    fileSingle: '文件',
    filePlural: '多个文件',
    browseLabel: '选择 &hellip;',
    removeLabel: '移除',
    removeTitle: '清除选中文件',
    cancelLabel: '取消',
    cancelTitle: '取消进行中的上传',
    uploadLabel: '上传',
    uploadTitle: '上传选中文件',
    msgNo: '没有',
    msgCancelled: '取消',
    msgZoomTitle: '查看详情',
    msgZoomModalHeading: '详细预览',
    msgSizeTooLarge: '文件 "{name}" (<b>{size} KB</b>) 超过了允许大小 <b>{maxSize} KB</b>.',
    msgFilesTooLess: '你必须选择最少 <b>{n}</b> {files} 来上传. ',
    msgFilesTooMany: '选择的上传文件个数 <b>({n})</b> 超出最大文件的限制个数 <b>{m}</b>.',
    msgFileNotFound: '文件 "{name}" 未找到!',
    msgFileSecured: '安全限制，为了防止读取文件 "{name}".',
    msgFileNotReadable: '文件 "{name}" 不可读.',
    msgFilePreviewAborted: '取消 "{name}" 的预览.',
    msgFilePreviewError: '读取 "{name}" 时出现了一个错误.',
    msgInvalidFileType: '不正确的类型 "{name}". 只支持 "{types}" 类型的文件.',
    msgInvalidFileExtension: '不正确的文件扩展名 "{name}". 只支持 "{extensions}" 的文件扩展名.',
    msgUploadAborted: '该文件上传被中止',
    msgValidationError: '验证错误',
    msgLoading: '加载第 {index} 文件 共 {files} &hellip;',
    msgProgress: '加载第 {index} 文件 共 {files} - {name} - {percent}% 完成.',
    msgSelected: '{n} {files} 选中',
    msgFoldersNotAllowed: '只支持拖拽文件! 跳过 {n} 拖拽的文件夹.',
    msgImageWidthSmall: '宽度的图像文件的"{name}"的必须是至少{size}像素.',
    msgImageHeightSmall: '图像文件的"{name}"的高度必须至少为{size}像素.',
    msgImageWidthLarge: '宽度的图像文件"{name}"不能超过{size}像素.',
    msgImageHeightLarge: '图像文件"{name}"的高度不能超过{size}像素.',
    msgImageResizeError: '无法获取的图像尺寸调整。',
    msgImageResizeException: '错误而调整图像大小。<pre>{errors}</pre>',
    dropZoneTitle: '拖拽文件到这里 &hellip;',
    fileActionSettings: {
      removeTitle: '删除文件',
      uploadTitle: '上传文件',
      indicatorNewTitle: '没有上传',
      indicatorSuccessTitle: '上传',
      indicatorErrorTitle: '上传错误',
      indicatorLoadingTitle: '上传 ...'
    }
  };


  $.fn.fileinput.defaults.language = 'zh';
})(window.jQuery);
