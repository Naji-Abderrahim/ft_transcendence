import { globalStyles } from "../services/GlobalStyles.js";

export class Auth extends HTMLElement {

	constructor () {
		super();
		this.verificationCode = '';

		this.root = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		this.root.appendChild(style);
		
		async function loadStyle(style, shadow) {
			const stylesheet = await globalStyles;
			shadow.adoptedStyleSheets = [stylesheet];
			const request = await fetch('/assets/styles/layouts/auth.css');
			const response = await request.text();
			style.textContent = response;
		}
		loadStyle(style, this.root);
	}

	connectedCallback() {
		const template = document.getElementById('auth-template');
		const content = template.content.cloneNode(true);
		this.root.appendChild(content);

		this.root.querySelector('.user-image').src = app.user.image;
		this.root.querySelector('.user-name').textContent = app.user.login;
		this.root.querySelector('.input').focus();

		this.setupInput();

        this.root.querySelector('.button-verify').addEventListener('click', async () => {
            if (this.verificationCode.length === 6) {
				try {
                    const response = await fetch('/api/user/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ user_input: this.verificationCode })
                    });

                    if (response.status === 401) {
                        Router.go('/');
                        return;
                    }
                    
                    if (response.status === 500) {
                        Router.go('/501-server-error');
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    if (response.status === 403) {
                        console.error('Verification failed');
                        return;
                    }

                    // update userProxy
					app.user.is_twofa_validated = true;
					console.log('verify-2fa-code success');
                    app.router.go(window.location.pathname);

                } catch (error) {
                    console.error('verify-2fa-code error:', error);
                }
			}
		});
	}

	setupInput() {
        const input = this.root.querySelector('.input');
		input.addEventListener('input', (e) => {
			const value = e.target.value.replace(/[^0-9]/g, '');
			e.target.value = value;
			this.verificationCode = input.value;

			input.addEventListener('keydown', (e) => {
				const length = this.verificationCode.length;
                if (e.key === 'Backspace' && length > 0) {
                    this.verificationCode = this.verificationCode.slice(length, length - 1);
                }
            });
		});
    }
}
customElements.define('auth-page', Auth);