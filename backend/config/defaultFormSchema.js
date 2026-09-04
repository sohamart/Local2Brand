export const defaultFormSchema = {
  name: 'Client Website Requirement & Onboarding Form',
  version: '3.0',
  versionNumber: 3,
  status: 'published',
  isPublished: true,
  categories: [
    { id: 'restaurant', name: 'Restaurant', icon: 'Utensils', badge: 'Popular', description: 'Table reservations, digital food menus, delivery & takeaway funnels', basePrice: 9999, popular: true, enabled: true, order: 1 },
    { id: 'cafe', name: 'Café / Coffee Shop', icon: 'Coffee', badge: 'Trending', description: 'Cozy lookbook, signature specials, table booking & takeaway ordering', basePrice: 8999, popular: true, enabled: true, order: 2 },
    { id: 'salon', name: 'Salon / Beauty Parlour', icon: 'Sparkles', badge: 'High Demand', description: 'Stylist portfolios, service rate-cards & online slot booking', basePrice: 8999, popular: true, enabled: true, order: 3 },
    { id: 'gym', name: 'Gym / Fitness Centre', icon: 'Dumbbell', badge: 'High ROI', description: 'Membership plans, trainer profiles, workout schedule & admissions', basePrice: 9999, popular: true, enabled: true, order: 4 },
    { id: 'hotel', name: 'Hotel / Resort', icon: 'Hotel', badge: 'Luxury', description: 'Room showcase, amenities, seasonal tariffs & direct room booking engine', basePrice: 14999, popular: false, enabled: true, order: 5 },
    { id: 'real_estate', name: 'Real Estate', icon: 'Building2', badge: 'Commercial', description: 'Property listings, virtual tours, map search & agent lead capture', basePrice: 14999, popular: false, enabled: true, order: 6 },
    { id: 'photography', name: 'Photography / Wedding Studio', icon: 'Camera', badge: 'Visual', description: 'High-res portfolio albums, package rates & client consultation booking', basePrice: 7999, popular: false, enabled: true, order: 7 },
    { id: 'boutique', name: 'Boutique / Clothing Store', icon: 'ShoppingBag', badge: 'E-Commerce', description: 'Apparel lookbook, size guides, cart checkout & fashion collections', basePrice: 12999, popular: true, enabled: true, order: 8 },
    { id: 'coaching', name: 'Coaching Centre / Institute', icon: 'GraduationCap', badge: 'Education', description: 'Course catalogues, batch schedules, faculty profiles & admission forms', basePrice: 9999, popular: false, enabled: true, order: 9 },
    { id: 'clinic', name: 'Clinic / Doctor', icon: 'Stethoscope', badge: 'Verified', description: 'Doctor bio, specialization, visiting hours & OPD consultation booking', basePrice: 9999, popular: false, enabled: true, order: 10 },
    { id: 'jewellery', name: 'Jewellery / Gift Shop', icon: 'Gem', badge: 'Prestige', description: 'Gold/diamond showcases, bridal collections & custom enquiry funnel', basePrice: 12999, popular: false, enabled: true, order: 11 },
    { id: 'showroom', name: 'Car / Bike Showroom & Service', icon: 'Car', badge: 'Automotive', description: 'Vehicle inventory, EMI calculators, test drive & service appointment booking', basePrice: 14999, popular: false, enabled: true, order: 12 },
    { id: 'other', name: 'Other', icon: 'Layers', badge: 'Custom', description: 'Bespoke custom architecture, web application or specialized business portal', basePrice: 9999, popular: false, enabled: true, order: 13 }
  ],
  steps: [
    { id: 'step_client', stepNumber: 1, title: 'Client / Personal Details', subtitle: "Let's Get Started with your contact and brand details", icon: 'User', enabled: true, order: 1 },
    { id: 'step_category', stepNumber: 2, title: 'Select Website Category', subtitle: 'What type of website do you need?', icon: 'Globe', enabled: true, order: 2 },
    { id: 'step_category_spec', stepNumber: 3, title: 'Category-Specific Requirements', subtitle: 'Industry specific features and operational specs', icon: 'Layers', enabled: true, order: 3 },
    { id: 'step_design', stepNumber: 4, title: 'Design & Color Theme', subtitle: 'Visual styling and aesthetic preferences', icon: 'Palette', enabled: true, order: 4 },
    { id: 'step_files', stepNumber: 5, title: 'Logo / Content / Files', subtitle: 'Upload brand assets, photos and reference links', icon: 'Image', enabled: true, order: 5 },
    { id: 'step_domain_hosting', stepNumber: 6, title: 'Domain & Hosting', subtitle: 'Separate domain registration and cloud hosting options', icon: 'Server', enabled: true, order: 6 },
    { id: 'step_backend_whatsapp', stepNumber: 7, title: 'Backend & WhatsApp', subtitle: 'Admin CMS panel and WhatsApp integration funnels', icon: 'Zap', enabled: true, order: 7 },
    { id: 'step_integrations', stepNumber: 8, title: 'Other Integrations', subtitle: 'Payment gateway, Google Maps, Analytics and APIs', icon: 'Shield', enabled: true, order: 8 },
    { id: 'step_final_details', stepNumber: 9, title: 'Final Project Details', subtitle: 'Budget tier, launch schedule and additional notes', icon: 'Clock', enabled: true, order: 9 },
    { id: 'step_review', stepNumber: 10, title: 'Review & Live Approx Price', subtitle: 'Executive scope summary, coupon code and submission', icon: 'CheckCircle', enabled: true, order: 10 }
  ],
  questions: [
    // ==========================================
    // STEP 1 — CLIENT / PERSONAL DETAILS (step_client)
    // ==========================================
    {
      id: 'client_full_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Full Name *',
      label: 'Full Name *',
      inputLabel: 'Full Name *',
      placeholder: 'e.g. Rahul Sharma / Ananya Sen',
      type: 'text',
      defaultValue: '',
      required: true,
      order: 1,
      enabled: true
    },
    {
      id: 'client_business_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Business / Brand Name *',
      label: 'Business / Brand Name *',
      inputLabel: 'Business / Brand Name *',
      placeholder: 'e.g. Urban Spoon / Royal Luxe Gems',
      type: 'text',
      defaultValue: '',
      required: true,
      order: 2,
      enabled: true
    },
    {
      id: 'client_mobile',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Mobile Number *',
      label: 'Mobile Number *',
      inputLabel: 'Mobile Number *',
      placeholder: 'e.g. 9876543210',
      type: 'phone',
      defaultValue: '',
      required: true,
      order: 3,
      enabled: true
    },
    {
      id: 'client_whatsapp',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'WhatsApp Number *',
      label: 'WhatsApp Number *',
      inputLabel: 'WhatsApp Number *',
      placeholder: 'e.g. 9876543210',
      type: 'phone',
      defaultValue: '',
      required: true,
      order: 4,
      enabled: true
    },
    {
      id: 'client_email',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Email Address *',
      label: 'Email Address *',
      inputLabel: 'Email Address *',
      placeholder: 'e.g. hello@yourbrand.com',
      type: 'email',
      defaultValue: '',
      required: true,
      order: 5,
      enabled: true
    },
    {
      id: 'client_address',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Business Address *',
      label: 'Business Address *',
      inputLabel: 'Business Address *',
      placeholder: 'Enter full business / registered address...',
      type: 'textarea',
      defaultValue: '',
      required: true,
      order: 6,
      enabled: true
    },
    {
      id: 'client_city',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'City / Location',
      label: 'City / Location (Optional)',
      inputLabel: 'City / Location',
      placeholder: 'e.g. Kolkata, West Bengal / Mumbai',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 7,
      enabled: true
    },
    {
      id: 'client_existing_website',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Existing Website',
      label: 'Existing Website (Optional)',
      inputLabel: 'Existing Website',
      placeholder: 'https://example.com (leave empty if new)',
      type: 'url',
      defaultValue: '',
      required: false,
      order: 8,
      enabled: true
    },
    {
      id: 'client_social_links',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Social Media Links',
      label: 'Social Media Links (Optional)',
      inputLabel: 'Social Media Links',
      placeholder: 'Add Instagram, Facebook, LinkedIn or YouTube profile links',
      type: 'multi_url',
      defaultValue: '',
      required: false,
      order: 9,
      enabled: true
    },

    // ==========================================
    // STEP 2 — SELECT WEBSITE CATEGORY (step_category)
    // ==========================================
    {
      id: 'selected_category',
      stepId: 'step_category',
      categoryId: 'all',
      title: 'What type of website do you need? *',
      label: 'Website Category *',
      inputLabel: 'Website Category *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 10,
      enabled: true,
      options: [
        { id: 'cat_restaurant', label: 'Restaurant', value: 'restaurant' },
        { id: 'cat_cafe', label: 'Café / Coffee Shop', value: 'cafe' },
        { id: 'cat_salon', label: 'Salon / Beauty Parlour', value: 'salon' },
        { id: 'cat_gym', label: 'Gym / Fitness Centre', value: 'gym' },
        { id: 'cat_hotel', label: 'Hotel / Resort', value: 'hotel' },
        { id: 'cat_real_estate', label: 'Real Estate', value: 'real_estate' },
        { id: 'cat_photography', label: 'Photography / Wedding Studio', value: 'photography' },
        { id: 'cat_boutique', label: 'Boutique / Clothing Store', value: 'boutique' },
        { id: 'cat_coaching', label: 'Coaching Centre / Institute', value: 'coaching' },
        { id: 'cat_clinic', label: 'Clinic / Doctor', value: 'clinic' },
        { id: 'cat_jewellery', label: 'Jewellery / Gift Shop', value: 'jewellery' },
        { id: 'cat_showroom', label: 'Car / Bike Showroom & Service', value: 'showroom' },
        { id: 'cat_other', label: 'Other', value: 'other' }
      ]
    },

    // ==========================================
    // STEP 3 — CATEGORY-SPECIFIC QUESTIONS (step_category_spec)
    // ==========================================
    // 1. RESTAURANT
    {
      id: 'rest_cuisine_type',
      stepId: 'step_category_spec',
      categoryId: 'restaurant',
      title: 'Restaurant Type / Cuisine *',
      label: 'Restaurant Type / Cuisine *',
      placeholder: 'e.g. Indian, Italian, Chinese, Mughlai, Multi-Cuisine',
      type: 'text',
      defaultValue: '',
      required: true,
      order: 20,
      enabled: true
    },
    {
      id: 'rest_social_media',
      stepId: 'step_category_spec',
      categoryId: 'restaurant',
      title: 'Current Social Media',
      label: 'Current Social Media',
      type: 'multi_select',
      defaultValue: '',
      required: false,
      order: 21,
      enabled: true,
      options: [
        { id: 'soc_fb', label: 'Facebook', value: 'Facebook' },
        { id: 'soc_insta', label: 'Instagram', value: 'Instagram' },
        { id: 'soc_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'rest_features',
      stepId: 'step_category_spec',
      categoryId: 'restaurant',
      title: 'Which features do you need? *',
      label: 'Restaurant Features *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 22,
      enabled: true,
      options: [
        { id: 'rf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'rf_menu', label: 'Food Menu', value: 'Food Menu' },
        { id: 'rf_table', label: 'Online Table Reservation', value: 'Online Table Reservation' },
        { id: 'rf_order', label: 'Online Food Ordering', value: 'Online Food Ordering' },
        { id: 'rf_gallery', label: 'Photo Gallery', value: 'Photo Gallery' },
        { id: 'rf_contact', label: 'Contact Page', value: 'Contact Page' },
        { id: 'rf_map', label: 'Google Map Integration', value: 'Google Map Integration' },
        { id: 'rf_reviews', label: 'Customer Reviews', value: 'Customer Reviews' },
        { id: 'rf_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'rest_style',
      stepId: 'step_category_spec',
      categoryId: 'restaurant',
      title: 'Preferred Website Style *',
      label: 'Preferred Website Style *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 23,
      enabled: true,
      options: [
        { id: 'rs_modern', label: 'Modern', value: 'Modern' },
        { id: 'rs_minimal', label: 'Minimal', value: 'Minimal' },
        { id: 'rs_premium', label: 'Premium', value: 'Premium' },
        { id: 'rs_other', label: 'Other', value: 'Other' }
      ]
    },

    // 2. CAFÉ / COFFEE SHOP
    {
      id: 'cafe_name',
      stepId: 'step_category_spec',
      categoryId: 'cafe',
      title: 'Café Name *',
      label: 'Café Name *',
      placeholder: 'Enter café name',
      type: 'text',
      defaultValue: '',
      required: true,
      order: 30,
      enabled: true
    },
    {
      id: 'cafe_features',
      stepId: 'step_category_spec',
      categoryId: 'cafe',
      title: 'Website Requirements *',
      label: 'Café Website Requirements *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 31,
      enabled: true,
      options: [
        { id: 'cf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'cf_about', label: 'About Us', value: 'About Us' },
        { id: 'cf_menu', label: 'Food & Drinks Menu', value: 'Food & Drinks Menu' },
        { id: 'cf_table', label: 'Online Table Booking', value: 'Online Table Booking' },
        { id: 'cf_gallery', label: 'Gallery', value: 'Gallery' },
        { id: 'cf_contact', label: 'Contact Page', value: 'Contact Page' },
        { id: 'cf_map', label: 'Google Map', value: 'Google Map' },
        { id: 'cf_reviews', label: 'Customer Reviews', value: 'Customer Reviews' },
        { id: 'cf_offers', label: 'Special Offers', value: 'Special Offers' },
        { id: 'cf_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'cafe_specialty',
      stepId: 'step_category_spec',
      categoryId: 'cafe',
      title: 'Specialty / Signature Items',
      label: 'Specialty Items (Optional)',
      placeholder: 'e.g. Artisanal Cappuccino, Blueberry Cheesecake, Sourdough Sandwiches',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 32,
      enabled: true
    },
    {
      id: 'cafe_hours',
      stepId: 'step_category_spec',
      categoryId: 'cafe',
      title: 'Opening Hours',
      label: 'Opening Hours (Optional)',
      placeholder: 'e.g. 8:00 AM – 10:00 PM (Everyday)',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 33,
      enabled: true
    },

    // 3. SALON / BEAUTY PARLOUR
    {
      id: 'salon_features',
      stepId: 'step_category_spec',
      categoryId: 'salon',
      title: 'Website Requirements *',
      label: 'Salon Website Requirements *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 40,
      enabled: true,
      options: [
        { id: 'sf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'sf_about', label: 'About Us', value: 'About Us' },
        { id: 'sf_services', label: 'Services & Pricing', value: 'Services & Pricing' },
        { id: 'sf_booking', label: 'Online Appointment Booking', value: 'Online Appointment Booking' },
        { id: 'sf_staff', label: 'Staff Profile', value: 'Staff Profile' },
        { id: 'sf_gallery', label: 'Gallery', value: 'Gallery' },
        { id: 'sf_contact', label: 'Contact Page', value: 'Contact Page' },
        { id: 'sf_map', label: 'Google Map', value: 'Google Map' },
        { id: 'sf_reviews', label: 'Customer Reviews', value: 'Customer Reviews' },
        { id: 'sf_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'salon_services',
      stepId: 'step_category_spec',
      categoryId: 'salon',
      title: 'Services Offered',
      label: 'Services Offered (Optional)',
      placeholder: 'e.g. Hair Styling, Bridal Makeup, Spa Therapies, Skin Treatments',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 41,
      enabled: true
    },

    // 4. GYM / FITNESS CENTRE
    {
      id: 'gym_features',
      stepId: 'step_category_spec',
      categoryId: 'gym',
      title: 'Website Requirements *',
      label: 'Gym Requirements *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 50,
      enabled: true,
      options: [
        { id: 'gf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'gf_about', label: 'About Us', value: 'About Us' },
        { id: 'gf_plans', label: 'Membership Plans', value: 'Membership Plans' },
        { id: 'gf_reg', label: 'Online Registration', value: 'Online Registration' },
        { id: 'gf_trainers', label: 'Trainer Profiles', value: 'Trainer Profiles' },
        { id: 'gf_gallery', label: 'Gallery', value: 'Gallery' },
        { id: 'gf_workouts', label: 'Workout Programs', value: 'Workout Programs' },
        { id: 'gf_contact', label: 'Contact Page', value: 'Contact Page' },
        { id: 'gf_map', label: 'Google Map', value: 'Google Map' },
        { id: 'gf_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'gym_facilities',
      stepId: 'step_category_spec',
      categoryId: 'gym',
      title: 'Facilities Available',
      label: 'Facilities Available (Optional)',
      placeholder: 'e.g. Cardio Zone, Crossfit Rig, Steam Bath, Personal Training',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 51,
      enabled: true
    },

    // 5. HOTEL / RESORT
    {
      id: 'hotel_features',
      stepId: 'step_category_spec',
      categoryId: 'hotel',
      title: 'Website Requirements *',
      label: 'Hotel Requirements *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 60,
      enabled: true,
      options: [
        { id: 'hf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'hf_about', label: 'About Us', value: 'About Us' },
        { id: 'hf_rooms', label: 'Rooms & Pricing', value: 'Rooms & Pricing' },
        { id: 'hf_booking', label: 'Online Booking', value: 'Online Booking' },
        { id: 'hf_gallery', label: 'Gallery', value: 'Gallery' },
        { id: 'hf_amenities', label: 'Amenities', value: 'Amenities' },
        { id: 'hf_restaurant', label: 'Restaurant Details', value: 'Restaurant Details' },
        { id: 'hf_contact', label: 'Contact Page', value: 'Contact Page' },
        { id: 'hf_map', label: 'Google Map', value: 'Google Map' },
        { id: 'hf_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'hotel_rooms_count',
      stepId: 'step_category_spec',
      categoryId: 'hotel',
      title: 'Number of Rooms',
      label: 'Number of Rooms (Optional)',
      placeholder: 'e.g. 25 Deluxe Rooms, 5 Suites',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 61,
      enabled: true
    },

    // 6. REAL ESTATE
    {
      id: 're_property_types',
      stepId: 'step_category_spec',
      categoryId: 'real_estate',
      title: 'Property Types *',
      label: 'Property Types *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 70,
      enabled: true,
      options: [
        { id: 'rep_land', label: 'Land', value: 'Land' },
        { id: 'rep_flat', label: 'Flat', value: 'Flat' },
        { id: 'rep_house', label: 'House', value: 'House' },
        { id: 'rep_commercial', label: 'Commercial', value: 'Commercial' },
        { id: 'rep_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 're_features',
      stepId: 'step_category_spec',
      categoryId: 'real_estate',
      title: 'Website Requirements *',
      label: 'Real Estate Requirements *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 71,
      enabled: true,
      options: [
        { id: 'rf_home', label: 'Home Page', value: 'Home Page' },
        { id: 'rf_about', label: 'About Us', value: 'About Us' },
        { id: 'rf_listings', label: 'Property Listings', value: 'Property Listings' },
        { id: 'rf_search', label: 'Property Search', value: 'Property Search' },
        { id: 'rf_details', label: 'Property Details', value: 'Property Details' },
        { id: 'rf_gallery', label: 'Image Gallery', value: 'Image Gallery' },
        { id: 'rf_agents', label: 'Agent Profiles', value: 'Agent Profiles' },
        { id: 'rf_enquiry', label: 'Enquiry Form', value: 'Enquiry Form' },
        { id: 'rf_map', label: 'Google Map', value: 'Google Map' },
        { id: 'rf_other', label: 'Other', value: 'Other' }
      ]
    },

    // 7. PHOTOGRAPHY / WEDDING STUDIO
    {
      id: 'photo_types',
      stepId: 'step_category_spec',
      categoryId: 'photography',
      title: 'Photography Type *',
      label: 'Photography Type *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 80,
      enabled: true,
      options: [
        { id: 'pt_wedding', label: 'Wedding', value: 'Wedding' },
        { id: 'pt_portrait', label: 'Portrait', value: 'Portrait' },
        { id: 'pt_event', label: 'Event', value: 'Event' },
        { id: 'pt_other', label: 'Other', value: 'Other' }
      ]
    },

    // 8. BOUTIQUE / CLOTHING STORE
    {
      id: 'boutique_products',
      stepId: 'step_category_spec',
      categoryId: 'boutique',
      title: 'Products *',
      label: 'Products *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 90,
      enabled: true,
      options: [
        { id: 'bp_mens', label: "Men's", value: "Men's" },
        { id: 'bp_womens', label: "Women's", value: "Women's" },
        { id: 'bp_kids', label: 'Kids', value: 'Kids' },
        { id: 'bp_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'boutique_delivery',
      stepId: 'step_category_spec',
      categoryId: 'boutique',
      title: 'Delivery Available? *',
      label: 'Delivery Available? *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 91,
      enabled: true,
      options: [
        { id: 'bd_yes', label: 'Yes', value: 'Yes' },
        { id: 'bd_no', label: 'No', value: 'No' }
      ]
    },

    // 9. COACHING CENTRE / INSTITUTE
    {
      id: 'coaching_mode',
      stepId: 'step_category_spec',
      categoryId: 'coaching',
      title: 'Class Mode *',
      label: 'Class Mode *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 100,
      enabled: true,
      options: [
        { id: 'cm_offline', label: 'Offline', value: 'Offline' },
        { id: 'cm_online', label: 'Online', value: 'Online' },
        { id: 'cm_both', label: 'Both', value: 'Both' }
      ]
    },

    // 10. CLINIC / DOCTOR
    {
      id: 'clinic_specialization',
      stepId: 'step_category_spec',
      categoryId: 'clinic',
      title: 'Specialization *',
      label: 'Specialization *',
      placeholder: 'e.g. Dentistry, Dermatology, Cardiology, General Physician',
      type: 'text',
      defaultValue: '',
      required: true,
      order: 110,
      enabled: true
    },

    // 11. JEWELLERY / GIFT SHOP
    {
      id: 'jewel_categories',
      stepId: 'step_category_spec',
      categoryId: 'jewellery',
      title: 'Product Categories',
      label: 'Product Categories (Optional)',
      placeholder: 'e.g. Gold, Diamond, Silver, Bridal Sets, Custom Gifts',
      type: 'text',
      defaultValue: '',
      required: false,
      order: 120,
      enabled: true
    },

    // 12. CAR / BIKE SHOWROOM & SERVICE
    {
      id: 'showroom_business_type',
      stepId: 'step_category_spec',
      categoryId: 'showroom',
      title: 'Business Type *',
      label: 'Business Type *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 130,
      enabled: true,
      options: [
        { id: 'sb_car', label: 'Car', value: 'Car' },
        { id: 'sb_bike', label: 'Bike', value: 'Bike' },
        { id: 'sb_both', label: 'Both', value: 'Both' }
      ]
    },

    // ==========================================
    // STEP 4 — DESIGN & COLOR THEME (step_design)
    // ==========================================
    {
      id: 'design_style',
      stepId: 'step_design',
      categoryId: 'all',
      title: 'What kind of visual style do you prefer? *',
      label: 'Visual Style *',
      inputLabel: 'Visual Style *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 140,
      enabled: true,
      options: [
        { id: 'vs_modern', label: 'Modern', value: 'Modern' },
        { id: 'vs_minimal', label: 'Minimal', value: 'Minimal' },
        { id: 'vs_premium', label: 'Premium', value: 'Premium' },
        { id: 'vs_luxury', label: 'Luxury', value: 'Luxury' },
        { id: 'vs_professional', label: 'Professional', value: 'Professional' },
        { id: 'vs_creative', label: 'Creative', value: 'Creative' },
        { id: 'vs_elegant', label: 'Elegant', value: 'Elegant' },
        { id: 'vs_bold', label: 'Bold', value: 'Bold' },
        { id: 'vs_simple', label: 'Simple', value: 'Simple' },
        { id: 'vs_dark', label: 'Dark', value: 'Dark' },
        { id: 'vs_light', label: 'Light', value: 'Light' },
        { id: 'vs_other', label: 'Other', value: 'Other' }
      ]
    },
    {
      id: 'design_color_theme',
      stepId: 'step_design',
      categoryId: 'all',
      title: 'What color theme would you like? *',
      label: 'Color Theme *',
      inputLabel: 'Color Theme *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 141,
      enabled: true,
      options: [
        { id: 'ct_blue', label: 'Blue', value: 'Blue' },
        { id: 'ct_green', label: 'Green', value: 'Green' },
        { id: 'ct_red', label: 'Red', value: 'Red' },
        { id: 'ct_purple', label: 'Purple', value: 'Purple' },
        { id: 'ct_orange', label: 'Orange', value: 'Orange' },
        { id: 'ct_bw', label: 'Black & White', value: 'Black & White' },
        { id: 'ct_dark', label: 'Dark', value: 'Dark' },
        { id: 'ct_light', label: 'Light', value: 'Light' },
        { id: 'ct_custom', label: 'Custom', value: 'Custom' }
      ]
    },

    // ==========================================
    // STEP 5 — LOGO / CONTENT / FILES (step_files)
    // ==========================================
    {
      id: 'has_logo',
      stepId: 'step_files',
      categoryId: 'all',
      title: 'Do you have a Logo? *',
      label: 'Logo Available? *',
      inputLabel: 'Logo Available? *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 150,
      enabled: true,
      options: [
        { id: 'hl_yes', label: 'Yes', value: 'Yes' },
        { id: 'hl_no', label: 'No', value: 'No' }
      ]
    },
    {
      id: 'has_photos',
      stepId: 'step_files',
      categoryId: 'all',
      title: 'Do you have Photos? *',
      label: 'Photos Available? *',
      inputLabel: 'Photos Available? *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 151,
      enabled: true,
      options: [
        { id: 'hp_yes', label: 'Yes', value: 'Yes' },
        { id: 'hp_no', label: 'No', value: 'No' }
      ]
    },
    {
      id: 'has_content',
      stepId: 'step_files',
      categoryId: 'all',
      title: 'Do you have Website Content? *',
      label: 'Content Available? *',
      inputLabel: 'Content Available? *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 152,
      enabled: true,
      options: [
        { id: 'hc_yes', label: 'Yes', value: 'Yes' },
        { id: 'hc_no', label: 'No', value: 'No' }
      ]
    },

    // ==========================================
    // STEP 6 — DOMAIN & HOSTING (step_domain_hosting)
    // ==========================================
    {
      id: 'domain_requirement',
      stepId: 'step_domain_hosting',
      categoryId: 'all',
      title: 'Do you need a Domain? *',
      label: 'Domain Requirement *',
      inputLabel: 'Domain Requirement *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 160,
      enabled: true,
      options: [
        { id: 'dom_have', label: 'I already have a Domain', value: 'I already have a Domain' },
        { id: 'dom_need', label: 'I need a new Domain (₹999 / Year)', value: 'I need a new Domain' }
      ]
    },
    {
      id: 'hosting_requirement',
      stepId: 'step_domain_hosting',
      categoryId: 'all',
      title: 'Do you need Hosting? *',
      label: 'Hosting Requirement *',
      inputLabel: 'Hosting Requirement *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 161,
      enabled: true,
      options: [
        { id: 'host_have', label: 'I already have Hosting', value: 'I already have Hosting' },
        { id: 'host_need', label: 'I need new Hosting (₹1,999 / Year)', value: 'I need new Hosting' }
      ]
    },

    // ==========================================
    // STEP 7 — BACKEND & WHATSAPP (step_backend_whatsapp)
    // ==========================================
    {
      id: 'backend_panel_requirement',
      stepId: 'step_backend_whatsapp',
      categoryId: 'all',
      title: 'Do you need a Backend / Admin Panel? *',
      label: 'Backend / Admin Panel *',
      inputLabel: 'Backend / Admin Panel *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 170,
      enabled: true,
      options: [
        { id: 'bp_none', label: 'No Backend Required', value: 'No Backend Required' },
        { id: 'bp_backend', label: 'Backend Required', value: 'Backend Required' },
        { id: 'bp_admin', label: 'Admin Panel Required', value: 'Admin Panel Required' },
        { id: 'bp_both', label: 'Backend + Admin Panel', value: 'Backend + Admin Panel' },
        { id: 'bp_custom', label: 'Custom Backend Requirement', value: 'Custom Backend Requirement' }
      ]
    },
    {
      id: 'whatsapp_integration_type',
      stepId: 'step_backend_whatsapp',
      categoryId: 'all',
      title: 'Do you need WhatsApp Integration? *',
      label: 'WhatsApp Integration *',
      inputLabel: 'WhatsApp Integration *',
      type: 'radio',
      defaultValue: '',
      required: true,
      order: 171,
      enabled: true,
      options: [
        { id: 'wa_none', label: 'No WhatsApp Integration', value: 'No WhatsApp Integration' },
        { id: 'wa_chat', label: 'WhatsApp Chat Button', value: 'WhatsApp Chat Button' },
        { id: 'wa_enquiry', label: 'WhatsApp Enquiry', value: 'WhatsApp Enquiry' },
        { id: 'wa_order', label: 'WhatsApp Order', value: 'WhatsApp Order' },
        { id: 'wa_booking', label: 'WhatsApp Booking', value: 'WhatsApp Booking' },
        { id: 'wa_custom', label: 'Custom WhatsApp Integration', value: 'Custom WhatsApp Integration' }
      ]
    },

    // ==========================================
    // STEP 8 — OTHER INTEGRATIONS (step_integrations)
    // ==========================================
    {
      id: 'other_integrations',
      stepId: 'step_integrations',
      categoryId: 'all',
      title: 'Do you need any additional integrations? *',
      label: 'Additional Integrations *',
      inputLabel: 'Additional Integrations *',
      type: 'multi_select',
      defaultValue: '',
      required: true,
      order: 180,
      enabled: true,
      options: [
        { id: 'int_maps', label: 'Google Maps', value: 'Google Maps' },
        { id: 'int_pay', label: 'Payment Gateway', value: 'Payment Gateway' },
        { id: 'int_email', label: 'Email Integration', value: 'Email Integration' },
        { id: 'int_social', label: 'Social Media Integration', value: 'Social Media Integration' },
        { id: 'int_analytics', label: 'Google Analytics', value: 'Google Analytics' },
        { id: 'int_newsletter', label: 'Newsletter', value: 'Newsletter' },
        { id: 'int_booking', label: 'Booking System', value: 'Booking System' },
        { id: 'int_api', label: 'API Integration', value: 'API Integration' },
        { id: 'int_wa', label: 'WhatsApp', value: 'WhatsApp' },
        { id: 'int_other', label: 'Other', value: 'Other' }
      ]
    },

    // ==========================================
    // STEP 9 — FINAL PROJECT INFORMATION (step_final_details)
    // ==========================================
    {
      id: 'budget_tier',
      stepId: 'step_final_details',
      categoryId: 'all',
      title: 'Estimated Budget',
      label: 'Estimated Budget (Optional)',
      inputLabel: 'Estimated Budget',
      type: 'radio',
      defaultValue: '',
      required: false,
      order: 190,
      enabled: true,
      options: [
        { id: 'bt_under_10k', label: 'Under ₹10,000', value: 'Under ₹10,000' },
        { id: 'bt_10k_25k', label: '₹10,000 – ₹25,000', value: '₹10,000 – ₹25,000' },
        { id: 'bt_25k_50k', label: '₹25,000 – ₹50,000', value: '₹25,000 – ₹50,000' },
        { id: 'bt_50k_100k', label: '₹50,000 – ₹1,00,000', value: '₹50,000 – ₹1,00,000' },
        { id: 'bt_above_100k', label: 'Above ₹1,00,000', value: 'Above ₹1,00,000' },
        { id: 'bt_custom', label: 'Custom Budget', value: 'Custom Budget' }
      ]
    },
    {
      id: 'expected_launch_date',
      stepId: 'step_final_details',
      categoryId: 'all',
      title: 'Expected Launch Date',
      label: 'Expected Launch Date (Optional)',
      inputLabel: 'Expected Launch Date',
      type: 'date',
      defaultValue: '',
      required: false,
      order: 191,
      enabled: true
    },
    {
      id: 'additional_notes',
      stepId: 'step_final_details',
      categoryId: 'all',
      title: 'Additional Requirements',
      label: 'Additional Requirements (Optional)',
      inputLabel: 'Additional Requirements',
      placeholder: 'Tell us about any specific preferences, brand goals, or timeline requirements...',
      type: 'textarea',
      defaultValue: '',
      required: false,
      order: 192,
      enabled: true
    },
    {
      id: 'final_anything_else',
      stepId: 'step_final_details',
      categoryId: 'all',
      title: 'Anything else we should know?',
      label: 'Anything else we should know? (Optional)',
      inputLabel: 'Anything else we should know?',
      placeholder: 'Any special instructions for the development team...',
      type: 'textarea',
      defaultValue: '',
      required: false,
      order: 193,
      enabled: true
    }
  ]
};
