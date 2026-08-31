import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const restaurant = await Restaurant.findOne({ slug: slug.toLowerCase() });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { name, slug, tagline, description, cuisine, template, primaryColor, secondaryColor, ownerName, ownerEmail, ownerPassword } = req.body;

    const formattedSlug = (slug || name.toLowerCase().replace(/\s+/g, '-')).toLowerCase();
    const existing = await Restaurant.findOne({ slug: formattedSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Restaurant slug is already taken.' });
    }

    const restaurant = await Restaurant.create({
      name,
      slug: formattedSlug,
      tagline: tagline || 'Artisan Culinary Experience',
      description: description || `Welcome to ${name}, serving handcrafted culinary delights.`,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
      heroImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
      cuisine: cuisine ? (Array.isArray(cuisine) ? cuisine : cuisine.split(',').map(s => s.trim())) : ['Fine Dining'],
      theme: {
        template: template || 'luxury',
        primary: primaryColor || '#e63946',
        secondary: secondaryColor || '#dfa645',
        accent: '#2a9d8f'
      },
      sections: {
        hero: { enabled: true, title: `Welcome to ${name}`, subtitle: 'Crafted culinary perfection delivered fresh.' },
        specials: { enabled: true, title: "Chef's Signature Selections" },
        story: { enabled: true, title: 'Our Heritage & Mastery' },
        offers: { enabled: true, title: 'Exclusive Client Privileges' },
        reviews: { enabled: true, title: 'What Patrons Say' },
        reservation: { enabled: true, title: 'Reserve a Private Banquet' }
      }
    });

    // Auto-create owner account if provided
    if (ownerEmail && ownerPassword) {
      await User.create({
        name: ownerName || `${name} Owner`,
        email: ownerEmail.toLowerCase(),
        password: ownerPassword,
        role: 'owner',
        restaurantId: restaurant._id
      });
    }

    res.status(201).json({ success: true, message: 'Restaurant client provisioned successfully.', data: restaurant });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurantTheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Restaurant.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    res.json({ success: true, message: 'Theme & settings updated.', data: updated });
  } catch (error) {
    next(error);
  }
};
