import { createElement } from './createElement.js';

export class FormCreator {
    static makeCityForm() {
        const form = createElement({ tag: 'div', className: 'city-form hidden' });

        const card = createElement({ tag: 'div', className: 'form-card' });

        const close = createElement({ tag: 'button', className: 'close-btn', text: 'x' });

        const title = createElement({ tag: 'h2', text: 'Добавить город' });

        const group = createElement({ tag: 'div', className: 'form-group' });

        const inp = createElement({
            tag: 'input', className: 'city-inp',
            attributes: {
                placeholder: 'Название города',
                autocomplete: 'off'
            }
        });

        const sugg = createElement({ tag: 'div', className: 'suggestion hidden' });

        const err = createElement({ tag: 'div', className: 'err-msg' });

        const actions = createElement({ tag: 'div', className: 'form-actions' });

        const submit = createElement({ tag: 'button', className: 'btn submit-btn', text: 'Добавить' });

        const cancel = createElement({ tag: 'button', className: 'btn cancel-btn', text: 'Отмена' });

        group.append(inp, sugg, err);
        actions.append(submit, cancel);
        card.append(close, title, group, actions);
        form.append(card);

        return { form, inp, sugg, err, submitBtn: submit, cancelBtn: cancel, closeBtn: close };
    }

    static makeLocForm() {
        const form = createElement({ tag: 'div', className: 'loc-form hidden' });

        const card = createElement({ tag: 'div', className: 'form-card' });

        const close = createElement({ tag: 'button', className: 'close-btn', text: 'x' });

        const title = createElement({ tag: 'h2', text: 'Выберите город' });

        const desc = createElement({ tag: 'p', className: 'desc', text: 'Введите город или используйте геолокацию' });

        const group = createElement({ tag: 'div', className: 'form-group' });

        const inp = createElement({
            tag: 'input', className: 'city-inp',
            attributes: {
                placeholder: 'Название города',
                autocomplete: 'off'
            }
        });

        const sugg = createElement({ tag: 'div', className: 'suggestion hidden' });

        const err = createElement({ tag: 'div', className: 'err-msg' });

        const actions = createElement({ tag: 'div', className: 'form-actions' });

        const submit = createElement({ tag: 'button', className: 'btn submit-btn', text: 'Показать' });

        const retry = createElement({ tag: 'button', className: 'btn retry-btn', text: 'Геолокация' });

        group.append(inp, sugg, err);
        actions.append(submit, retry);
        card.append(close, title, desc, group, actions);
        form.append(card);

        return { form, inp, sugg, err, submitBtn: submit, retryBtn: retry, closeBtn: close };
    }
}