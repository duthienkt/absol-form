import 'absol/src/absol';
import form from '.';
import Fcore from './js/core/FCore';
import Dom from 'absol/src/HTML5/Dom';
import Svg from 'absol/src/HTML5/Svg';

window.absol = window.absol || {};
window.absol.form = form;
window.absol._ = window.absol._ || Fcore._;
window.absol.$ = window.absol.$ || Fcore.$;
window.absol.Dom = window.absol.Dom || Dom;
window.absol.Svg = window.absol.Svg || Svg;