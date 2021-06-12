import RelativeLayout from "../layouts/RelativeLayout";
import LinearLayout from "../layouts/LinearLayout";
import ChainLayout from "../layouts/ChainLayout";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";
import TextArea from "./TextArea";
import NumberInput from "./NumberInput";
import ComboBox from "./ComboBox";
import MultiselectComboBox from "./MultiselectComboBox";
import TreeComboBox from "./TreeComboBox";
import CheckBox from "./Checkbox";
import TrackBar from "./TrackBar";
import TrackBarInput from "./TrackBarInput";
import TableInput from "./TableInput";
import ImageFileInput from "./ImageFileInput";
import Radio from "./Radio";
import Label from "./Label";
import Text from "./Text";
import Image from "./Image";
import Table from "./Table";
import Button from "./Button";
import ArrayOfFragment from "./ArrayOfFragment";
import EditableArrayOfFragment from "./EditableArrayOfFragment";
import Ellipse from "../shapes/Ellipse";
import Rectangle from "../shapes/Rectangle";
import DateTimeInput from "./DateTimeInput";
import FileInput from "./FileInput";
import TextInput from "./TextInput";

var ComponentTreeList = {
    text: "all",
    children: [
        {
            text: 'layout',
            children: [
                RelativeLayout,
                LinearLayout,
                ChainLayout
            ]
        },
        {
            text: 'input',
            children: [
                DateInput,
                TimeInput,
                DateTimeInput,
                TextInput,
                TextArea,
                NumberInput,
                ComboBox,
                MultiselectComboBox,
                TreeComboBox,
                Radio,
                CheckBox,
                TrackBar,
                TrackBarInput,
                TableInput,
                ImageFileInput,
                FileInput
            ]
        },
        {
            text: 'static',
            children: [
                Label,
                Text,
                Image,
                Table
            ]
        },
        {
            text: 'trigger',
            children: [
                Button
            ]
        },
        {
            text: 'mapping',
            children: [
                ArrayOfFragment,
                EditableArrayOfFragment
            ]
        },
        {
            text: 'shape',
            children: [
                Ellipse,
                Rectangle
            ]
        },
        {
            text: 'fragment',
            children: []
        },
        {
            text: 'template',
            children: []
        }
    ]
};

export default ComponentTreeList;