import  "../core/Assembler";
import CBFunction from "./CBFunction";
import CBSnackBar from "./CBSnackBar";
import CBFileDownloader from "./CBFileDownloader";
import CBEntry from "./CBEntry";
import CBTimer from "./CBTimer";
import CBRadioGroup from "./CBRadioGroup";
import CBPropsGate from "./CBPropsGate";

var BlockTreeList = {
    text: 'all',
    children: [
        CBEntry,
        CBFunction,
        CBFileDownloader,
        CBTimer,
        CBRadioGroup,
        CBPropsGate,
        {
            text: 'message',
            children: [
                CBSnackBar
            ]
        }
    ]
};
export default BlockTreeList;