// Paste this into browser DevTools console on http://localhost:3005/publish/widgets
// It will trace the stacking context from the first widget card up to body
(function () {
    // Find the first PublishWidgetsItem card
    const card = document.querySelector('[class*="PublishWidgetsItem"]');
    if (!card) { console.log('Card not found!'); return; }

    let el = card;
    const chain = [];

    while (el && el !== document.body.parentElement) {
        const style = getComputedStyle(el);
        const info = {
            tag: el.tagName,
            class: el.className.split(' ').map(c => {
                // Extract only the meaningful part of CSS module class names
                const match = c.match(/module__(\w+)/);
                return match ? match[1] : '';
            }).filter(Boolean).join(', '),
            overflow: style.overflow,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
            position: style.position,
            zIndex: style.zIndex,
            transform: style.transform !== 'none' ? style.transform : '-',
            backdropFilter: style.backdropFilter !== 'none' ? style.backdropFilter : '-',
            isolation: style.isolation,
            contain: style.contain,
        };
        chain.push(info);
        el = el.parentElement;
    }

    console.table(chain);

    // Highlight any elements that clip overflow
    chain.forEach((info, i) => {
        if (info.overflowX === 'hidden' || info.overflowY === 'hidden' || info.overflow === 'hidden') {
            console.warn(`⚠️ OVERFLOW HIDDEN at index ${i}:`, info.class || info.tag);
        }
        if (info.zIndex !== 'auto' && info.position !== 'static') {
            console.log(`🔷 STACKING CONTEXT at index ${i}: z-index=${info.zIndex}, position=${info.position}`, info.class || info.tag);
        }
        if (info.backdropFilter !== '-') {
            console.log(`🔵 BACKDROP-FILTER (creates stacking context) at index ${i}:`, info.class || info.tag);
        }
        if (info.transform !== '-') {
            console.log(`🟡 TRANSFORM (creates stacking context) at index ${i}:`, info.class || info.tag);
        }
    });
})();
