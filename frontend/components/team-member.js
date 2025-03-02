
export class TeamMember extends HTMLElement {

	constructor () {
		super();

		const template = document.getElementById('team-member-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}

	connectedCallback() {
		this.render();
		window.addEventListener('appmemberchange', () => {
			this.render();
		});
	}

	async render() {
		const member = JSON.parse(this.dataset.memberId);

		this.querySelector("img").src = `../assets/images/${member.login}.webp`;
		this.querySelector(".member-name").textContent = member.name;
		this.querySelector(".member-role").textContent = member.role;
		this.querySelector(".member-description-text").textContent = member.description;
		this.querySelector(".github-icon").href = member.github;
		this.querySelector(".linkedin-icon").href = member.linkedin;
	}

}

customElements.define('team-member-component', TeamMember);