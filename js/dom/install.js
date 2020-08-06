import Dom from 'absol/src/HTML5/Dom';
export var publicCreators = [];

/***
 *
 * @param {Dom} core
 */
export default function install(core){
    return core.install(publicCreators);
}
