const checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'));
  }else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  }
};
const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'));
  }else {
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的邮箱'));
    }
  }
};
const checkPw = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'));
  }
  const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('密码必须包含数字,字母及特殊字符内两种组合且必须大于6位'));
  }

};

export  {checkPhone,checkEmail,checkPw}
