import { ScanQR } from "./scan.js";
import { VerifyAuthCode } from "./verify.js";

export class twoFactorSection extends HTMLElement {
	constructor () {
		super();
		
		const style = document.createElement('style');
		this.appendChild(style);

		async function loadStyle(style) {
			const request = await fetch('/assets/styles/components/two-factor-sec.css');
			const response = await request.text();
			style.textContent = response;
		}
		loadStyle(style);
	}

	async connectedCallback() {
		const template = document.getElementById('two-factor-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);

		this.render();
		window.addEventListener('apptwofactorstepchanged', () =>{
			this.render('verify');
		});
	}

	async render(step = 'scan') {
		const section = this.querySelector('.two-factor-section');
		section.innerHTML = '';
		if (step === 'verify') {
			const verifySection = new VerifyAuthCode();
			section.appendChild(verifySection);
			return;
		}
		const scanSection = new ScanQR();
		section.appendChild(scanSection);
	}
}

customElements.define('two-factor-section', twoFactorSection);