import { createElement } from './createElement.js';

export class SuccessModal {
    constructor() {
        this.modal = null;
        this.title = null;
        this.description = null;
        this.autoHideTimeout = null;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        this.modal = createElement({ tag: 'div', className: 'success-modal hidden' });

        const modalContent = createElement({ tag: 'div', className: 'success-modal-content' });

        this.title = createElement({ tag: 'h3', className: 'success-title', text: 'Город успешно добавлен' });

        this.description = createElement({ tag: 'p', className: 'success-description',
            text: 'Новый город добавлен'
        });

        this.closeBtn = createElement({ tag: 'button', className: 'btn submit-btn close-success-btn', text: 'OK' });

        modalContent.appendChild(this.title);
        modalContent.appendChild(this.description);
        modalContent.appendChild(this.closeBtn);
        this.modal.appendChild(modalContent);

        document.body.appendChild(this.modal);
    }

    bindEvents() {
        this.closeBtn.onclick = () => this.hide();

        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        };
    }

    show(message = 'Город успешно добавлен', details = 'Новый город добавлен') {
        this.title.textContent = message;
        this.description.textContent = details;

        this.modal.classList.remove('hidden');
        this.modal.classList.add('active');

        clearTimeout(this.autoHideTimeout);
        this.autoHideTimeout = setTimeout(() => {
            this.hide();
        }, 1500);
    }

    hide() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.classList.add('hidden');
        }, 300);
    }

    isActive() {
        return this.modal.classList.contains('active');
    }
}