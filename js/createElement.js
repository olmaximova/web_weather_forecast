export function createElement({
    tag,
    text = "",
    className = "",
    attributes = {},
    events = {},
    dataset = {},
}) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text) element.textContent = text;

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    Object.entries(events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
    });

    Object.entries(dataset).forEach(([key, value]) => {
        element.dataset[key] = value;
    });

    return element;
}