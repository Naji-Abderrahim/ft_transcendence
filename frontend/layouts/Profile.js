import { globalStyles } from "../services/GlobalStyles.js";
import { NavBar } from "../components/nav-bar.js";

export class Profile extends HTMLElement {

	constructor () {
		super();
		this.root = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		this.root.appendChild(style);

		async function loadStyle(style, shadow) {
			const stylesheet = await globalStyles;
			shadow.adoptedStyleSheets = [stylesheet];
			const request = await fetch('/assets/styles/layouts/profile.css');
			const response = await request.text();
			style.textContent = response;
		}
		loadStyle(style, this.root);
	}

	async connectedCallback() {
		const template = document.getElementById('profile-template');
		const content = template.content.cloneNode(true);
		this.root.appendChild(content);

		
		if (app.user==null) {
			await app.dataLoader.fetchUser();
		}
		
		const navBar = new NavBar();
		this.root.querySelector('.nav-bar-container').appendChild(navBar);
		navBar.render(this.root);

		// const user = app.user;
		// this.root.querySelector('.profile-image img').src = user.image;
		// this.root.querySelector('.login').textContent = user.login;
		// this.root.querySelector('.full-name').textContent = `${user.first_name} ${user.last_name}`;
		// this.root.querySelector('.email').textContent = user.email;
	}

}

customElements.define('profile-page', Profile);