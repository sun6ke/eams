(function() {

  var root = this;

  var previousFormUtil = root.FormUtil;

  var FormUtil = function(obj) {
    if (obj instanceof FormUtil) return obj;
    if (!(this instanceof FormUtil)) return new FormUtil(obj);
    this._wrapped = obj;
  };

  // add `FormUtil` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = FormUtil;
    }
    exports.FormUtil = FormUtil;
  } else {
    root.FormUtil = FormUtil;
  }

  // Current version.
  FormUtil.VERSION = '0.0.1';

  FormUtil.defaults = {
    form : $("<form></form>"),
    url : "#",
    params: {},
    target: null
  };

  FormUtil.submitForm = function(option) {
    var params = {};
    if (option.params) {
      for (key in option.params) {
        if (option.params[key] || option.params[key] == false) {
          params[key] = option.params[key];
        }
      }
      FormUtil.addHiddenFields(option.form, params);
    }
    option.form.attr("method", option.method);
    option.form.attr("action", option.url);
    if (option.target != null) {
      option.form.attr("target", option.target);
    }
    if (!option.form.parent() || option.form.parent().length == 0) {
      option.form.appendTo('body').submit();
    } else {
      option.form.submit();
    }
  }

  FormUtil.collectParams = function(url) {
    var params = {};
    var questionMarkIndex = url.indexOf('?');
    if (questionMarkIndex != -1) {
      var queryString = url.substring(questionMarkIndex + 1);
      var components = queryString.split('&');
      for (var i = 0; i < components.length; i++) {
        var arr = components[i].split('=');
        if (arr.length == 1) {
          continue;
        }
        var paramName = arr[0];
        var paramValue = arr[1];
        if (!paramValue && paramName != false) {
          continue;
        }
        params[paramName] = decodeURIComponent(paramValue);
      }
    }
    return params;
  }

  FormUtil.get = function(option) {
    var option = $.extend({}, this.defaults, option, {method:"get"});
    var url = option.url;
    if (url.indexOf('?') != -1) {
      var params = this.collectParams(url);
      option.params = $.extend({}, params, option.params);
      option.url = url.substring(0, url.indexOf('?'));
    }
    this.submitForm(option);
  }

  FormUtil.post = function(option) {
    var option = $.extend({}, this.defaults, option, {method:"post"});
    this.submitForm(option);
  }

  var getFormDom = function ($form) {
    if (!$form.jquery) {
      throw new Error("not a jquery object");
    }
    return $form[0];
  };

  var getFieldByElement = function (elements, getEmpty) {
    var fieldHash = {};
    for(var i = 0;i < elements.length; i++) {
      if ("" === elements[i].name) continue;
      if ("params" == elements[i].name) continue;
      if ((elements[i].value == "") && (!getEmpty)) continue;

      if (elements[i].type.indexOf('select') != -1) {
        fieldHash[elements[i].name] = FormUtil.getSelectedValues(elements[i]);
      } else {
        if ((elements[i].type == "radio" || elements[i].type == "checkbox") && !elements[i].checked)
          continue;
        if (elements[i].type == "checkbox" && typeof(fieldHash[elements[i].name]) != "undefined" && fieldHash[elements[i].name] != "") {
          fieldHash[elements[i].name] = fieldHash[elements[i].name] + "," + elements[i].value;
          continue;
        }
        if (elements[i].value.indexOf('&') != -1) {
          fieldHash[elements[i].name] = escape(elements[i].value);
        } else {
          fieldHash[elements[i].name] = elements[i].value;
        }
      }
    }

    return fieldHash;
  }

  FormUtil.addHiddenFields = function($form, hiddenParams) {

    var form = getFormDom($form);
    $.each(hiddenParams, function(key, value) {
      if (key) {
        if(form[key]!=null && (typeof form[key].tagName)!="undefined"){
          var param = {key: value};
          FormUtil.updateFields($form, param);
        }else{
          var input = document.createElement('input');
          input.setAttribute("name",key);
          input.setAttribute("value",value);
          input.setAttribute("type", "hidden");
          form.appendChild(input);
        }
      }
    });
  }

  /** 如果name重复,更新所有同名的域的值 */
  FormUtil.updateFields = function($form, params) {
    if (!params) {
      return;
    }
    var form = getFormDom($form);
    $.each(params, function(key, value) {
      var elements = form[key];
      if(elements!=null && (typeof elements.tagName)!="undefined"){
        if (elements.length === 0) {
          elements.value = value;
        } else {
          $.each(elements, function(i, element) {
            element.value = value;
          });
        }
      }
    });
  }

  FormUtil.transferFields = function() {
    var args = arguments;
    var $form = args[0];
    var $to = args[1];
    var fieldNames,getEmpty;
    if (args.length == 3) {
      if (typeof args[2] == "boolean") {
        getEmpty = args[2];
      } else {
        fieldNames = args[2];
      }
    } else if (args.length > 3) {
      fieldNames = args[2];
      getEmpty = args[3];
    }
    if(null == getEmpty) {
      getEmpty = true;
    }
    var params = FormUtil.getFieldValues($form, fieldNames, getEmpty);
    FormUtil.addHiddenFields($to, params);
  }

  FormUtil.clearFields = function($form, fieldNames) {
    if (!fieldNames || fieldNames.length == 0) {
      $form.remove();
    } else {
      $.each(fieldNames, function(index, fieldName) {
        $form.find("[name='"+fieldName+"']").remove();
      });
    }
  }

  FormUtil.getFieldValues = function (){
    var args = arguments;
    var $form = args[0];
    var fieldNames,getEmpty;
    if (args.length == 2) {
      if (typeof args[1] == "boolean") {
        getEmpty = args[1];
      } else {
        fieldNames = args[1];
      }
    } else if (args.length > 2) {
      fieldNames = args[1];
      getEmpty = args[2];
    }

    var elements = [];
    if(null == getEmpty) {
      getEmpty=true;
    }

    if (!fieldNames || fieldNames.length == 0) {
      if ($form) {
        elements = getFormDom($form).elements;
      }
    } else {
      $.each(fieldNames, function (index, fieldName) {
        var element = $form.find("[name='" + fieldName + "']");
        for (var i=0; i<element.length; i++) {
          elements.push(element[i]);
        }
      });
    }
    return getFieldByElement(elements, getEmpty);
  }

  FormUtil.getSelectedValues = function (select){
    var val = [];
    var options = select.options;
    for (var i = 0; i < options.length; i++){
      if (options[i].selected){
        val.push(options[i].value);
      }
    }
    return val;
  }

  /**
   * dom enhance 对selectize, input, selectPicker等方法进行封装
   *
   */
  FormUtil._extendInput = function ($ele) {
    $ele.disable = function () {
      this.prop('disabled', true);
    }
    $ele.enable = function () {
      this.prop('disabled', false);
    }
    $ele.getValue = function () {
      return this.val().trim();
    }
    $ele.clear = function () {
      this.val('');
    }
  };

  FormUtil._extendSelectPicker = function ($ele) {
    $ele.disable = function () {
      this.prop('disabled', true);
      this.selectpicker('refresh');
    }
    $ele.enable = function () {
      this.prop('disabled', false);
      this.selectpicker('refresh');
    }
    $ele.getValue = function () {
      return this.val();
    }
    $ele.clear = function () {
      this.val('');
      this.selectpicker('refresh');
    }
    $ele.getSelectedItems = function () {
      return $.map($ele.find("option:selected"), function (option) {
        return {"value": option.value, "text": option.text};
      });
    }
  };

  FormUtil._extendSelectize = function ($ele) {
    $ele.disable = function () {
      this.prop('disabled', true);
      $ele[0].selectize.disable();
    }
    $ele.enable = function () {
      this.prop('disabled', false);
      $ele[0].selectize.enable();
    }
    $ele.getValue = function () {
      return this.val();
    }
    $ele.clear = function () {
      $ele[0].selectize.clear();
    }
    $ele.clearOptions = function() {
      $ele[0].selectize.clearOptions();
    }
    $ele.getSelectedItems = function () {
      // https://github.com/brianreavis/selectize.js/issues/373
      var selectize = $ele[0].selectize;
      var values = selectize.getValue();
      values = $.isArray(values) ? values : [values];
      return $.map(values, function (value) {
        return selectize.options[value];
      });
    }
  };

  FormUtil.dateRange = function ($s, $e) {
    if (!$s.data("DateTimePicker") || !$e.data("DateTimePicker")) {
      return;
    }

    $s.on("dp.change", function (e) {
      if (e.date == null) {
        $e.data("DateTimePicker").minDate(false);
      } else {
        $e.data("DateTimePicker").minDate(e.date);
      }
    });

    $e.on("dp.change", function (e) {
      if (e.date == null) {
        $s.data("DateTimePicker").maxDate(false);
      } else {
        $s.data("DateTimePicker").maxDate(e.date);
      }
    });

    var sDate = $s.data("DateTimePicker").date();
    if (sDate) {
      $e.data("DateTimePicker").minDate(sDate);
    }
    var eDate = $e.data("DateTimePicker").date();
    if (eDate) {
      $s.data("DateTimePicker").maxDate(eDate);
    }
  }

  FormUtil.locales = {};

  // noConflict
  // -----------------
  FormUtil.noConflict = function() {
    root.FormUtil = previousFormUtil;
    return this;
  };

}.call(this));
