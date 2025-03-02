import { globalStyles } from "../services/GlobalStyles.js";
import { NavBar } from "../components/nav-bar.js";
import { Rule } from "../components/rule.js";
import { twoFactorSection } from "../components/two-factor-sec.js";

export class Home extends HTMLElement {
	game_id = 0;
	constructor () {
		super();

		this.root = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		this.root.appendChild(style);
		
		async function loadStyle(style, shadow) {
			const stylesheet = await globalStyles;
			shadow.adoptedStyleSheets = [stylesheet];
			const request = await fetch('/assets/styles/layouts/home.css');
			const response = await request.text();
			style.textContent = response;
		}
		loadStyle(style, this.root);
	}
	
	async connectedCallback() {
		const template = document.getElementById('home-template');
		const content = template.content.cloneNode(true);
		this.root.appendChild(content);

		if (app.dataLoader.games===null) {
			await app.dataLoader.fetchGames();
		}

		const navBar = new NavBar();
		this.root.querySelector('.nav-bar-container').appendChild(navBar);

		const gameInfo = this.root.querySelector('.game-info');
		gameInfo.dataset.gameId = JSON.stringify(app.dataLoader.games[this.game_id]);
		this.root.querySelectorAll('.swip-button').forEach(button => {
			button.addEventListener('click', () => {
				if (button.id === 'left' && this.game_id > 0) {
					this.game_id = (this.game_id - 1) % app.dataLoader.games.length;
				} else {
					this.game_id = (this.game_id + 1) % app.dataLoader.games.length;
				}
				gameInfo.dataset.gameId = JSON.stringify(app.dataLoader.games[this.game_id]);
				window.dispatchEvent(new Event('appgamechange'));
			});
		});
		
		this.render();
		window.addEventListener('appgamechange', () => {
			this.render();
		});

		window.addEventListener('apptwofactortriggered', () => {
			this.enable_two_factor();
		});
		
		window.addEventListener('apptwofactorsectionremove', () => {
			this.removeTwoFactorSection();
		});
		
		app.router.init_links(this.root);
	}

	async render() {
		const gameInfo = this.root.querySelector('.game-info');
		const game = await JSON.parse(gameInfo.dataset.gameId);
		this.root.querySelector('.game-image').src = game.logo;
		this.root.querySelector(".description .text").textContent = game.description;
		const rules = this.root.querySelector('.rules');
		rules.innerHTML = '';
		game.rules.forEach(element => {
			const rule = new Rule();
			rule.dataset.ruleId = JSON.stringify(element);
			rules.appendChild(rule);
		});
	}
	
	async enable_two_factor() {
		this.root.querySelector('.home-container').classList.add('blur');
		const twoFactorSec = new twoFactorSection();
		this.root.appendChild(twoFactorSec);

		// Close two-factor-section when clicked outside
		document.addEventListener('click', (event) => {
			const path = event.composedPath();
			if (!path.some(element => 
				element.classList && (
					element.classList.contains('dropdown-item') ||
					element.classList.contains('two-factor-section')
				)
			)) {
				this.removeTwoFactorSection();
			}
		});
	}

	removeTwoFactorSection() {
		const twoFactorElement = this.root.querySelector('two-factor-section');
		if (twoFactorElement) {
			this.root.removeChild(twoFactorElement);
			this.root.querySelector('.home-container').classList.remove('blur');
		}
	}
}

customElements.define('home-page', Home);