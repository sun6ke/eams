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
