
export class VerifyAuthCode extends HTMLElement {
    constructor() {
        super();
        this.verificationCode = '';  
    }

    connectedCallback() {
        const template = document.getElementById('enable2fa-step2-template');
        const content = template.content.cloneNode(true);
        this.appendChild(content);

        this.setupInputs();

        this.querySelector('.button-verify').addEventListener('click', async () => {
            if (this.verificationCode.length === 6) {
                try {
                    const response = await fetch('/api/user/enable2FA', {
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

                    
                    if (response.status === 403) {
                        console.error('Verification failed');
                        return;
                    }
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    //update userProxy
                    app.user.twoFA = true;
                    console.log('2FA enabled');
                    window.dispatchEvent(new Event('apptwofactorsectionremove'));

                } catch (error) {
                    console.error('Enable-2fa error:', error);
                }
            }
        });
    }

    setupInputs() {
        const inputs = this.querySelectorAll('.input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value.slice(0, 1);
                if (value.length === 1) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
                this.verificationCode = Array.from(inputs)
                    .map(input => input.value)
                    .join('');
                if (this.verificationCode.length === 6) {
                    this.querySelector('.button').classList.add('active-button');
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }
}

customElements.define('verify-auth-code', VerifyAuthCode);