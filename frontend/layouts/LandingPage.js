import { TeamMember } from "../components/team-member.js";
import { globalStyles } from '../services/GlobalStyles.js';

export class LandingPage extends HTMLElement {

	constructor () {
		super();

		this.root = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		this.root.appendChild(style);
		
		async function loadStyle(style, shadow) {
			const stylesheet = await globalStyles;
			shadow.adoptedStyleSheets = [stylesheet];
			const request = await fetch('/assets/styles/layouts/landing-page.css');
			const response = await request.text();
			style.textContent = response;
		}
		loadStyle(style, this.root);
	}

	async connectedCallback() {
		const template = document.getElementById('landing-page-template');
		const content = template.content.cloneNode(true);
		this.root.appendChild(content);

		const section = this.root.getElementById('upper-block');
		const teamMember = new TeamMember();
		if (app.dataLoader.members==null) {
			await app.dataLoader.fetchMembers();
		}
		teamMember.dataset.memberId = JSON.stringify(app.dataLoader.members[0]);
		section.appendChild(teamMember);

		const members = this.root.querySelectorAll('.team-member');

		members.forEach(member => {
			member.addEventListener('click', () => {
				const currentMember = JSON.parse(teamMember.dataset.memberId);
				teamMember.dataset.memberId = JSON.stringify(app.dataLoader.members.filter(e => e.login==member.id)[0]);
				member.id = currentMember.login;
				member.querySelector("img").src = `/assets/images/${currentMember.login}.webp`;
				window.dispatchEvent(new Event('appmemberchange'));
			});
		});

		this.root.querySelector('.button').addEventListener('click', () => {
			window.location.href = 'https://darify.com/login';
			// app.router.go('/home');
		});
		app.scroller.init();
	}	

}

customElements.define('landing-page', LandingPage);