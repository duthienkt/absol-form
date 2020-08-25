import 'absol/src/polyfill';
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
import FormEditor from './js/editor/FormEditor'
import AllPropertyEditor from './js/editor/AllPropertyEditor';
import AttributeEditor from './js/editor/AttributeEditor';
import ComponentOutline from './js/editor/ComponentOutline';
import ComponentPicker from './js/editor/ComponentPicker';
import ListEditor from './js/editor/ListEditor';
import PropertyEditor from './js/editor/PropertyEditor';
import StyleEditor from './js/editor/StyleEditor';
import ContentScalelessComponent from './js/core/ContentScalelessComponent';
import ScalableComponent from './js/core/ScalableComponent';
import FModel from './js/core/FModel';
import FNode from './js/core/FNode';
import FViewable from './js/core/FViewable';
import Button from './js/components/Button';
import CheckBox from './js/components/Checkbox';
import ComboBox from './js/components/ComboBox';
import Image from './js/components/Image';
import Label from './js/components/Label';
import NumberInput from './js/components/NumberInput';
import Radio from './js/components/Radio';
import Table from './js/components/Table';
import Text from './js/components/Text';
import TextArea from './js/components/TextArea';
import RelativeAnchorEditor from './js/anchoreditors/RelativeAnchorEditor';
import LayoutSizeEditor from './js/propertyeditors/LayoutSizeEditor';
import PluginManager from './js/core/PluginManager';
import R from './js/R';
import * as framePlugins from './js/frame/plugins';
import LayoutEditorCmd from './js/cmds/LayoutEditorCmd';
import FormPreviewCmd, {FormPreviewCmdDescriptors} from './js/cmds/FormPreviewCmd';
import FormEditorPreconfig from './js/FormEditorPreconfig';
import MPOTMergeTool from "./js/MPOTMergeTool/MPOTMergeTool";
import MPOTBaseEditor from "./js/MPOTMergeTool/edit/MPOTBaseEditor";
import MPOTGroupEditor from "./js/MPOTMergeTool/edit/MPOTGroupEditor";
import MPOTNotSupportEditor from "./js/MPOTMergeTool/edit/MPOTNotSupportEditor";
import MPOTNumberEditor from "./js/MPOTMergeTool/edit/MPOTNumberEditor";
import MPOTTextEditor from "./js/MPOTMergeTool/edit/MPOTTextEditor";
import MPOTBasePreview from "./js/MPOTMergeTool/preview/MPOTBasePreview";
import MPOTGroupPreview from "./js/MPOTMergeTool/preview/MPOTGroupPreview";
import MPOTImagePreview from "./js/MPOTMergeTool/preview/MPOTImagePreview";
import MPOTNotSupportPreview from "./js/MPOTMergeTool/preview/MPOTNotSupportPreview";
import MPOTNumberPreview from "./js/MPOTMergeTool/preview/MPOTNumberPreview";
import MPOTTextPreview from "./js/MPOTMergeTool/preview/MPOTTextPreview";
import * as MPOTTypeHandler from "./js/MPOTMergeTool/TypeHandler";

export default {
    FormEditorPreconfig: FormEditorPreconfig,
    framePlugin: framePlugins,
    R: R,
    AllPropertyEditor: AllPropertyEditor,
    AttributeEditor: AttributeEditor,
    AnchorEditor: RelativeAnchorEditor,
    ComponentOutline: ComponentOutline,
    ComponentPicker: ComponentPicker,
    ListEditor: ListEditor,
    PropertyEditor: PropertyEditor,
    StyleEditor: StyleEditor,
    LayoutSizeEditor: LayoutSizeEditor,
    LayoutEditorCmd: LayoutEditorCmd,
    FormPreviewCmd: FormPreviewCmd,
    FormPreviewCmdDescriptors: FormPreviewCmdDescriptors,
    PluginManager: PluginManager,
    FViewable: FViewable,
    FNode: FNode,
    FModel: FModel,
    FormEditor: FormEditor,
    LayoutEditor: LayoutEditor,

    ScalableComponent: ScalableComponent,
    ContentScalelessComponent: ContentScalelessComponent,
    RelativeAnchor: RelativeAnchor,
    BaseComponent: BaseComponent,
    RelativeLayout: RelativeLayout,
    TextInput: TextInput,
    DateInput: DateInput,
    Button: Button,
    CheckBox: CheckBox,
    ComboBox: ComboBox,
    Image: Image,
    Label: Label,
    NumberInput: NumberInput,
    Radio: Radio,
    Table: Table,
    Text: Text,
    TextArea: TextArea,

    Assembler: Assembler,
    MPOTMergeTool: MPOTMergeTool,
    core: Fcore,
    mpot: {
        MPOTMergeTool: MPOTMergeTool,
        MPOTBaseEditor: MPOTBaseEditor,
        MPOTGroupEditor: MPOTGroupEditor,
        MPOTNotSupportEditor: MPOTNotSupportEditor,
        MPOTNumberEditor: MPOTNumberEditor,
        MPOTTextEditor: MPOTTextEditor,
        MPOTBasePreview: MPOTBasePreview,
        MPOTGroupPreview: MPOTGroupPreview,
        MPOTImagePreview: MPOTImagePreview,
        MPOTNotSupportPreview: MPOTNotSupportPreview,
        MPOTNumberPreview: MPOTNumberPreview,
        MPOTTextPreview: MPOTTextPreview,
        typeHandler: MPOTTypeHandler
    }
};

