const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';
const ICON_STAR = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 6.6 4.4 10.3 12 12-7.6 1.7-11.3 5.4-12 12-.7-6.6-4.4-10.3-12-12 7.6-1.7 11.3-5.4 12-12z"/></svg>';
const ICON_HEART = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

/* Elysian Distinctions — our own recognition tiers, derived from guest rating */
function getDistinction(rating) {
    const r = Number(rating) || 0;
    if (r >= 4.7) return { level: 3, label: 'Exceptional' };
    if (r >= 4.5) return { level: 2, label: 'Highly Recommended' };
    if (r >= 4.3) return { level: 1, label: 'Recommended' };
    return null;
}
function renderDistinction(rating) {
    const d = getDistinction(rating);
    if (!d) return '';
    return `<div class="dist"><span class="dist-marks">${ICON_STAR.repeat(d.level)}</span>${d.label}</div>`;
}

/* Saved kitchens (bookmarks), persisted locally */
const Saved = {
    KEY: 'elysian_saved',
    all() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
    has(id) { return this.all().includes(id); },
    toggle(id) {
        const list = this.all();
        const i = list.indexOf(id);
        i >= 0 ? list.splice(i, 1) : list.push(id);
        try { localStorage.setItem(this.KEY, JSON.stringify(list)); } catch (e) {}
        return i < 0;
    },
    onClick(ev, id) {
        ev.stopPropagation();
        const on = this.toggle(id);
        document.querySelectorAll(`[data-save="${id}"]`).forEach(b => {
            b.classList.toggle('on', on);
            if (b.classList.contains('btn')) b.textContent = on ? 'Saved ✓' : 'Save';
            else { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
        });
        showToast(on ? 'Saved to your shortlist' : 'Removed from your shortlist', 'info');
        if (typeof RestaurantListPage !== 'undefined' && RestaurantListPage.state && RestaurantListPage.state.saved) RestaurantListPage.apply();
    }
};

function restaurantPhoto(r) {
    return r.imageUrl && !r.imageUrl.startsWith('/api/images') ? r.imageUrl : getCuisinePhoto(r.cuisineType);
}

function renderRestaurantCard(restaurant, index = 0) {
    const r = restaurant;
    const isOpen = r.open || r.isOpen;
    const area = r.address ? r.address.area : 'Dhaka';
    return `
        <article class="rc" data-id="${r.id}" data-reveal style="--i:${index % 3}" onclick="App.navigate('restaurant/${r.id}')">
            <div class="rc-media">
                <img src="${restaurantPhoto(r)}" alt="${r.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_PHOTO}'">
                <button class="rc-save ${Saved.has(r.id) ? 'on' : ''}" data-save="${r.id}" aria-label="Save ${r.name}" onclick="Saved.onClick(event, '${r.id}')">${ICON_HEART}</button>
                <div class="rc-status ${isOpen ? '' : 'closed'}"><i></i>${isOpen ? 'Open now' : 'Closed'}</div>
            </div>
            <div class="rc-body">
                <div class="rc-top">
                    <h3 class="rc-name">${r.name}</h3>
                    <span class="rc-rating">★ ${r.rating ? r.rating.toFixed(1) : '4.5'}</span>
                </div>
                <div class="rc-sub">${r.cuisineType} · ${area}</div>
                ${renderDistinction(r.rating)}
                <p class="rc-desc">${r.description || 'Artisan cuisine, curated seasonal ingredients, freshly prepared.'}</p>
                <div class="rc-meta"><span>${r.estimatedDeliveryMinutes || 30} min</span><span>৳${r.deliveryFee || 40} delivery</span></div>
            </div>
        </article>`;
}
