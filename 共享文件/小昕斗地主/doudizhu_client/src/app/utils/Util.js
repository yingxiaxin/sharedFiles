/**
 * 静态工具类
 */
class Util {

}

/**
 * 移除字符串中开头和结尾的空格，同时，字符串内多个空格合并为一个
 */
Util.stripeWhiteSpace = function (str) {
    const reg1 = /^(\s+)|(\s+)$/g;
    const reg2 = /\s+/g;
    return str.replace(reg1, '').replace(reg2, ' ');
}

/**
 * 判断某个dom元素是否含有某个类名
 */
Util.hasClassName = function (dom, className) {
    const reg = new RegExp('\\b(' + className + ')\\b', 'g');
    return reg.test(dom.className);
}

/**
 * 为dom元素添加某个类名
 */
Util.addClassName = function (dom, className) {
    if (!Util.hasClassName(dom, className)) {
        dom.className = Util.stripeWhiteSpace(dom.className + ' ' + className);
    }
}

/**
 * 为dom元素移除某个类名
 */
Util.removeClassName = function (dom, className) {
    if (Util.hasClassName(dom, className)) {
        const reg = new RegExp('\\b(' + className + ')\\b', 'g');
        dom.className = Util.stripeWhiteSpace(dom.className.replace(reg, ''));
    }
}

/**
 * 为数组中的所有元素执行某个操作fn，除了某元素
 * @param array 要遍历的数组
 * @param exptItem  被排除不进行操作的元素
 * @param fn    需要执行的操作fn
 */
Util.doFnExcept = function (array, exptItem, fn, ...fnArgs) {
    array.forEach((item) => {
        if (item !== exptItem) {
            fn.call(this, item, ...fnArgs);
        }
    })
}

/**
 * 为数组中的所有元素执行某个操作fn
 * @param array 要遍历的数组
 * @param fn    需要执行的操作fn
 */
Util.doFnAll = function (array, fn, ...fnArgs) {
    array.forEach((item) => {
        fn.call(this, item, ...fnArgs);
    })
}

export default Util;