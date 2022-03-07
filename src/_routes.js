/**
 do not edit manual!!!! 
 pls run "yarn routes" or "npm run routes" to gen it 
*/

import HomeIndex from 'pages/Home/IndexPage';
import WalletAccount from 'pages/Wallet/AccountPage';
import WalletAccounts from 'pages/Wallet/AccountsPage';
import WalletAccountsSelect from 'pages/Wallet/AccountsSelectPage';
import WalletBswGame from 'pages/Wallet/BswGamePage';
import WalletBuses from 'pages/Wallet/BusesPage';
import WalletEstimate from 'pages/Wallet/EstimatePage';
import WalletIndex from 'pages/Wallet/IndexPage';
import WalletPlayers from 'pages/Wallet/PlayersPage';
import TestDemoAnimateAnimate1 from 'pages/Test/Demo/Animate/Animate1Page';
import TestDemoAnimateAnimate2 from 'pages/Test/Demo/Animate/Animate2Page';
import TestDemoWeuiBaseArticle from 'pages/Test/Demo/Weui/Base/ArticlePage';
import TestDemoWeuiBaseAvatar from 'pages/Test/Demo/Weui/Base/AvatarPage';
import TestDemoWeuiBaseBadge from 'pages/Test/Demo/Weui/Base/BadgePage';
import TestDemoWeuiBaseFlex from 'pages/Test/Demo/Weui/Base/FlexPage';
import TestDemoWeuiBaseFooter from 'pages/Test/Demo/Weui/Base/FooterPage';
import TestDemoWeuiBaseGallery from 'pages/Test/Demo/Weui/Base/GalleryPage';
import TestDemoWeuiBaseGrid from 'pages/Test/Demo/Weui/Base/GridPage';
import TestDemoWeuiBaseIcon from 'pages/Test/Demo/Weui/Base/IconPage';
import TestDemoWeuiBaseIcons from 'pages/Test/Demo/Weui/Base/IconsPage';
import TestDemoWeuiBaseList from 'pages/Test/Demo/Weui/Base/ListPage';
import TestDemoWeuiBaseLoading from 'pages/Test/Demo/Weui/Base/LoadingPage';
import TestDemoWeuiBaseLoadmore from 'pages/Test/Demo/Weui/Base/LoadmorePage';
import TestDemoWeuiBaseMap from 'pages/Test/Demo/Weui/Base/MapPage';
import TestDemoWeuiBasePanel from 'pages/Test/Demo/Weui/Base/PanelPage';
import TestDemoWeuiBasePreview from 'pages/Test/Demo/Weui/Base/PreviewPage';
import TestDemoWeuiBaseProgress from 'pages/Test/Demo/Weui/Base/ProgressPage';
import TestDemoWeuiBaseSearchBar from 'pages/Test/Demo/Weui/Base/SearchBarPage';
import TestDemoWeuiBaseSlider from 'pages/Test/Demo/Weui/Base/SliderPage';
import TestDemoWeuiBaseUploader from 'pages/Test/Demo/Weui/Base/UploaderPage';
import TestDemoWeuiFeedbackActionSheet from 'pages/Test/Demo/Weui/Feedback/ActionSheetPage';
import TestDemoWeuiFeedbackDialog from 'pages/Test/Demo/Weui/Feedback/DialogPage';
import TestDemoWeuiFeedbackHalfScreenDialog from 'pages/Test/Demo/Weui/Feedback/HalfScreenDialogPage';
import TestDemoWeuiFeedbackPicker from 'pages/Test/Demo/Weui/Feedback/PickerPage';
import TestDemoWeuiFeedbackToast from 'pages/Test/Demo/Weui/Feedback/ToastPage';
import TestDemoWeuiFeedbackTopTips from 'pages/Test/Demo/Weui/Feedback/TopTipsPage';
import TestDemoWeuiFormAccess from 'pages/Test/Demo/Weui/Form/AccessPage';
import TestDemoWeuiFormButton from 'pages/Test/Demo/Weui/Form/ButtonPage';
import TestDemoWeuiFormCaptcha from 'pages/Test/Demo/Weui/Form/CaptchaPage';
import TestDemoWeuiFormCheckBox from 'pages/Test/Demo/Weui/Form/CheckBoxPage';
import TestDemoWeuiFormForm from 'pages/Test/Demo/Weui/Form/FormPage';
import TestDemoWeuiFormInputStatus from 'pages/Test/Demo/Weui/Form/InputStatusPage';
import TestDemoWeuiFormRadio from 'pages/Test/Demo/Weui/Form/RadioPage';
import TestDemoWeuiFormSelectModal from 'pages/Test/Demo/Weui/Form/SelectModalPage';
import TestDemoWeuiFormSelect from 'pages/Test/Demo/Weui/Form/SelectPage';
import TestDemoWeuiFormSwitch from 'pages/Test/Demo/Weui/Form/SwitchPage';
import TestDemoWeuiFormTextarea from 'pages/Test/Demo/Weui/Form/TextareaPage';
import TestIndex from 'pages/Test/IndexPage';
import TestTestsAwait from 'pages/Test/Tests/AwaitPage';
import {Home404} from 'components/core/PageManager';


const Routes =  [
  {name: 'Home/Index', index:true,  component: HomeIndex},
  {name: 'Wallet/Account', component: WalletAccount},
  {name: 'Wallet/Accounts', component: WalletAccounts},
  {name: 'Wallet/AccountsSelect', component: WalletAccountsSelect},
  {name: 'Wallet/BswGame', component: WalletBswGame},
  {name: 'Wallet/Buses', component: WalletBuses},
  {name: 'Wallet/Estimate', component: WalletEstimate},
  {name: 'Wallet/Index', component: WalletIndex},
  {name: 'Wallet/Players', component: WalletPlayers},
  {name: 'Test/Demo/Animate/Animate1', component: TestDemoAnimateAnimate1},
  {name: 'Test/Demo/Animate/Animate2', component: TestDemoAnimateAnimate2},
  {name: 'Test/Demo/Weui/Base/Article', component: TestDemoWeuiBaseArticle},
  {name: 'Test/Demo/Weui/Base/Avatar', component: TestDemoWeuiBaseAvatar},
  {name: 'Test/Demo/Weui/Base/Badge', component: TestDemoWeuiBaseBadge},
  {name: 'Test/Demo/Weui/Base/Flex', component: TestDemoWeuiBaseFlex},
  {name: 'Test/Demo/Weui/Base/Footer', component: TestDemoWeuiBaseFooter},
  {name: 'Test/Demo/Weui/Base/Gallery', component: TestDemoWeuiBaseGallery},
  {name: 'Test/Demo/Weui/Base/Grid', component: TestDemoWeuiBaseGrid},
  {name: 'Test/Demo/Weui/Base/Icon', component: TestDemoWeuiBaseIcon},
  {name: 'Test/Demo/Weui/Base/Icons', component: TestDemoWeuiBaseIcons},
  {name: 'Test/Demo/Weui/Base/List', component: TestDemoWeuiBaseList},
  {name: 'Test/Demo/Weui/Base/Loading', component: TestDemoWeuiBaseLoading},
  {name: 'Test/Demo/Weui/Base/Loadmore', component: TestDemoWeuiBaseLoadmore},
  {name: 'Test/Demo/Weui/Base/Map', component: TestDemoWeuiBaseMap},
  {name: 'Test/Demo/Weui/Base/Panel', component: TestDemoWeuiBasePanel},
  {name: 'Test/Demo/Weui/Base/Preview', component: TestDemoWeuiBasePreview},
  {name: 'Test/Demo/Weui/Base/Progress', component: TestDemoWeuiBaseProgress},
  {name: 'Test/Demo/Weui/Base/SearchBar', component: TestDemoWeuiBaseSearchBar},
  {name: 'Test/Demo/Weui/Base/Slider', component: TestDemoWeuiBaseSlider},
  {name: 'Test/Demo/Weui/Base/Uploader', component: TestDemoWeuiBaseUploader},
  {name: 'Test/Demo/Weui/Feedback/ActionSheet', component: TestDemoWeuiFeedbackActionSheet},
  {name: 'Test/Demo/Weui/Feedback/Dialog', component: TestDemoWeuiFeedbackDialog},
  {name: 'Test/Demo/Weui/Feedback/HalfScreenDialog', component: TestDemoWeuiFeedbackHalfScreenDialog},
  {name: 'Test/Demo/Weui/Feedback/Picker', component: TestDemoWeuiFeedbackPicker},
  {name: 'Test/Demo/Weui/Feedback/Toast', component: TestDemoWeuiFeedbackToast},
  {name: 'Test/Demo/Weui/Feedback/TopTips', component: TestDemoWeuiFeedbackTopTips},
  {name: 'Test/Demo/Weui/Form/Access', component: TestDemoWeuiFormAccess},
  {name: 'Test/Demo/Weui/Form/Button', component: TestDemoWeuiFormButton},
  {name: 'Test/Demo/Weui/Form/Captcha', component: TestDemoWeuiFormCaptcha},
  {name: 'Test/Demo/Weui/Form/CheckBox', component: TestDemoWeuiFormCheckBox},
  {name: 'Test/Demo/Weui/Form/Form', component: TestDemoWeuiFormForm},
  {name: 'Test/Demo/Weui/Form/InputStatus', component: TestDemoWeuiFormInputStatus},
  {name: 'Test/Demo/Weui/Form/Radio', component: TestDemoWeuiFormRadio},
  {name: 'Test/Demo/Weui/Form/SelectModal', component: TestDemoWeuiFormSelectModal},
  {name: 'Test/Demo/Weui/Form/Select', component: TestDemoWeuiFormSelect},
  {name: 'Test/Demo/Weui/Form/Switch', component: TestDemoWeuiFormSwitch},
  {name: 'Test/Demo/Weui/Form/Textarea', component: TestDemoWeuiFormTextarea},
  {name: 'Test/Index', component: TestIndex},
  {name: 'Test/Tests/Await', component: TestTestsAwait},
  {name: 'Home/404', component: Home404}
];

export default Routes;