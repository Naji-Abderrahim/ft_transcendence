import Router from "./services/Router.js"
import Scroller from "./services/Scroller.js"
import DataLoader from "./services/DataLoader.js"
import User from "./models/user.js"

// Import All App layouts
import {LandingPage} from "./layouts/LandingPage.js"
import {Profile} from "./layouts/Profile.js"
import {Home} from "./layouts/Home.js"
import {Auth} from "./layouts/auth.js"
import {InvalidPath} from "./layouts/404.js"

// Import All App Components
import {TeamMember} from "./components/team-member.js"
import {twoFactorSection} from "./components/two-factor-sec.js"
import {ScanQR} from "./components/scan.js"
import {VerifyAuthCode} from "./components/verify.js"
import {Rule} from "./components/rule.js"
import {Day} from "./components/day.js"
import {NavBar} from "./components/nav-bar.js"
import {MatchRecord} from "./components/match-record.js"
import {ProfileSetting} from "./components/profile-setting.js"



window.app = {};
app.router = Router;
app.scroller = Scroller;
app.dataLoader = DataLoader;
app.user = User;


window.addEventListener('DOMContentLoaded', async () => {
	app.router.init();
})