// TNE i18n — inline strategy: EN text stored in data-i18n-en attributes
(function () {
    var KEY = 'tne_lang';
    var current = localStorage.getItem(KEY) || 'fr';

    function cache() {
        document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
            if (!el._fr) el._fr = el.innerHTML;
        });
        document.querySelectorAll('[data-i18n-ph-en]').forEach(function (el) {
            if (!el._fr_ph) el._fr_ph = el.placeholder || '';
        });
    }

    function apply(lang) {
        current = lang;
        localStorage.setItem(KEY, lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
            el.innerHTML = lang === 'en' ? el.dataset.i18nEn : (el._fr || el.innerHTML);
        });
        document.querySelectorAll('[data-i18n-ph-en]').forEach(function (el) {
            el.placeholder = lang === 'en' ? el.dataset.i18nPhEn : (el._fr_ph || el.placeholder);
        });
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === lang);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        cache();
        apply(current);
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.dataset.lang); });
        });
    });
})();
