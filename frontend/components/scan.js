export class ScanQR extends HTMLElement {

	constructor () {
		super();
	}

	async connectedCallback() {
		const template = document.getElementById('enable2fa-step1-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);

		await app.dataLoader.fetchTwoFaCredentials();
		this.querySelector('.qr-code').src = app.dataLoader.twoFa.image;

		this.querySelector('.button').addEventListener('click', () => {
			window.dispatchEvent(new Event('apptwofactorstepchanged'));
		});
	}

}

customElements.define('scan-qr-component', ScanQR);