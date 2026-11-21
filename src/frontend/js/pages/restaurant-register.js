const RestaurantRegisterPage = {
    render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="container section" style="max-width:720px">
                <div style="margin-bottom:28px">
                    <div class="section-eyebrow">Partner Application</div>
                    <h1 class="section-heading-editorial">Add Your Kitchen</h1>
                    <p class="section-desc-editorial" style="margin-bottom:0">Join Dhaka's curated dining network. Connect your kitchen with discerning food lovers.</p>
                </div>

                <div class="card" style="padding:28px">
                    <form onsubmit="RestaurantRegisterPage.handleSubmit(event)" id="register-restaurant-form">
                        <div class="form-group">
                            <label class="form-label">Establishment / Kitchen Name *</label>
                            <input type="text" class="form-input" id="rest-name" required placeholder="e.g. Copper Chimney Bistro">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Culinary Story & Specialties *</label>
                            <textarea class="form-input" id="rest-desc" required rows="3" placeholder="Tell customers about your recipes, culinary tradition, and ingredients..."></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Primary Cuisine *</label>
                            <select class="form-select" id="rest-cuisine" required>
                                <option value="Bengali">Bengali Heritage</option>
                                <option value="Italian">Italian & Pizzeria</option>
                                <option value="Chinese">Chinese & Cantonese</option>
                                <option value="American">American Bistro & Burger</option>
                                <option value="Japanese">Japanese & Sushi</option>
                                <option value="Indian">North / South Indian</option>
                                <option value="Thai">Thai & Southeast Asian</option>
                                <option value="Korean">Korean BBQ & Bowls</option>
                                <option value="Mexican">Mexican & Latin Grill</option>
                                <option value="Mediterranean">Mediterranean & Mezze</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Opening Time</label>
                                <input type="text" class="form-input" id="rest-open" value="11:00 AM" placeholder="11:00 AM">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Closing Time</label>
                                <input type="text" class="form-input" id="rest-close" value="11:00 PM" placeholder="11:00 PM">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Delivery Fee (৳)</label>
                                <input type="number" class="form-input" id="rest-delivery-fee" value="50" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Estimated Cook + Delivery Time (minutes)</label>
                                <input type="number" class="form-input" id="rest-delivery-time" value="30" min="10">
                            </div>
                        </div>
                        
                        <h4 style="font-family:var(--font-serif);font-size:1.15rem;font-weight:600;margin:24px 0 12px;padding-top:16px;border-top:1px solid var(--border-hairline)">Kitchen Location</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Neighborhood / Area *</label>
                                <input type="text" class="form-input" id="rest-area" required placeholder="e.g. Banani, Gulshan 1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">City</label>
                                <input type="text" class="form-input" id="rest-city" value="Dhaka">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Street Address</label>
                            <input type="text" class="form-input" id="rest-street" placeholder="Road, House, Floor">
                        </div>

                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="reg-rest-btn" style="margin-top:20px">
                            Register Kitchen Partner
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    async handleSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('reg-rest-btn');
        btn.disabled = true;
        btn.textContent = 'Registering kitchen...';

        try {
            const user = Session.getUser();
            const data = {
                ownerId: user.id,
                name: document.getElementById('rest-name').value,
                description: document.getElementById('rest-desc').value,
                cuisineType: document.getElementById('rest-cuisine').value,
                openingTime: document.getElementById('rest-open').value,
                closingTime: document.getElementById('rest-close').value,
                deliveryFee: parseFloat(document.getElementById('rest-delivery-fee').value),
                estimatedDeliveryMinutes: parseInt(document.getElementById('rest-delivery-time').value),
                address: {
                    area: document.getElementById('rest-area').value,
                    city: document.getElementById('rest-city').value,
                    street: document.getElementById('rest-street').value,
                    latitude: 23.7925,
                    longitude: 90.4078
                }
            };

            const result = await API.createRestaurant(data);
            showToast('Kitchen registered successfully!', 'success');
            App.navigate('owner-dashboard');
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Register Kitchen Partner';
        }
    }
};
