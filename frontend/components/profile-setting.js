export class ProfileSetting extends HTMLElement {

	constructor () {
		super();
	}

	connectedCallback() {
		const template = document.getElementById('profile-setting-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}

}

customElements.define('profile-setting-component', ProfileSetting);