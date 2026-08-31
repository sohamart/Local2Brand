import Restaurant from '../models/Restaurant.js';

export const resolveTenant = async (req, res, next) => {
  try {
    let tenantIdentifier = req.headers['x-tenant-id'] || req.query.tenantId || req.params.tenantId;

    // Subdomain resolution if applicable
    if (!tenantIdentifier && req.headers.host) {
      const hostParts = req.headers.host.split('.');
      if (hostParts.length > 2 && hostParts[0] !== 'www' && hostParts[0] !== 'localhost') {
        tenantIdentifier = hostParts[0];
      }
    }

    if (tenantIdentifier) {
      let restaurant = null;
      if (tenantIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
        restaurant = await Restaurant.findById(tenantIdentifier);
      } else {
        restaurant = await Restaurant.findOne({ slug: tenantIdentifier.toLowerCase() });
      }

      if (restaurant) {
        req.tenant = restaurant;
        req.tenantId = restaurant._id;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
