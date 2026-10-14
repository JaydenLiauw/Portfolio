console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'Resume/', title: 'Resume' },
    { url: 'https://github.com/JaydenLiauw', title: 'GitHub' }
];

const BASE_PATH = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? '/'
    : '/Portfolio/';

let nav = document.querySelector('nav');

for (let p of pages) {
    let a = document.createElement('a');
    a.href = p.url.startsWith('http') ? p.url : BASE_PATH + p.url;
    a.textContent = p.title;

    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
}

let navLinks = $$('nav a');

let currentLink = navLinks.find(
    a => a.host === location.host && a.pathname === location.pathname
);

if (currentLink) {
    currentLink.classList.add('current');
}
