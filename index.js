import './css/base.css'
import './css/layouteditor.css'

import RelativeAnchor from './js/anchors/RelativeAnchor'
import TextInput from './js/components/TextInput'
import RelativeLayout from './js/layouts/RelativeLayout'
import Assembler from './js/core/Assembler'
import DateInput from './js/components/DateInput'
import BaseComponent from './js/core/BaseComponent'
import LayoutEditor from './js/editor/LayoutEditor'
import Fcore from './js/core/FCore'

export default {
    LayoutEditor: LayoutEditor,
    RelativeAnchor:RelativeAnchor,
    BaseComponent: BaseComponent,
    TextInput:TextInput,
    RelativeLayout: RelativeLayout,
    Assembler: Assembler,
    DateInput: DateInput,
    core: Fcore
};