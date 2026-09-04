export const defaultFormSchema = {
  name: 'Client Website Requirement & Onboarding Form',
  version: '2.0',
  versionNumber: 2,
  status: 'published',
  isPublished: true,
  categories: [
    { id: 'restaurant', name: 'Restaurant / Fine Dining', icon: 'Utensils', badge: 'Popular', description: 'Table reservations, digital food menus, delivery & takeaway funnels', popular: true, enabled: true, order: 1 },
    { id: 'cafe', name: 'Café / Coffee Shop / Bakery', icon: 'Coffee', badge: 'Trending', description: 'Cozy lookbook, signature specials, table booking & takeaway ordering', popular: true, enabled: true, order: 2 },
    { id: 'salon', name: 'Salon / Spa / Beauty Studio', icon: 'Sparkles', badge: 'High Demand', description: 'Stylist portfolios, service rate-cards & online slot booking', popular: true, enabled: true, order: 3 },
    { id: 'gym', name: 'Gym / Fitness Hub / Crossfit', icon: 'Dumbbell', badge: 'High ROI', description: 'Membership plans, trainer profiles, workout schedule & admissions', popular: true, enabled: true, order: 4 },
    { id: 'hotel', name: 'Hotel / Resort / Homestay', icon: 'Hotel', badge: 'Luxury', description: 'Room showcase, amenities, seasonal tariffs & direct room booking engine', popular: false, enabled: true, order: 5 },
    { id: 'real_estate', name: 'Real Estate / Property Agency', icon: 'Building2', badge: 'Commercial', description: 'Property listings, virtual tours, map search & agent lead capture', popular: false, enabled: true, order: 6 },
    { id: 'photography', name: 'Photography / Wedding Studio', icon: 'Camera', badge: 'Visual', description: 'High-res portfolio albums, package rates & client consultation booking', popular: false, enabled: true, order: 7 },
    { id: 'boutique', name: 'Boutique / Clothing & Fashion', icon: 'ShoppingBag', badge: 'E-Commerce', description: 'Apparel lookbook, size guides, cart checkout & fashion collections', popular: true, enabled: true, order: 8 },
    { id: 'coaching', name: 'Coaching / EdTech / LMS', icon: 'GraduationCap', badge: 'Education', description: 'Course catalogues, batch schedules, faculty profiles & admission forms', popular: false, enabled: true, order: 9 },
    { id: 'clinic', name: 'Clinic / Doctor / Healthcare', icon: 'Stethoscope', badge: 'Verified', description: 'Doctor bio, specialization, visiting hours & OPD consultation booking', popular: false, enabled: true, order: 10 },
    { id: 'jewellery', name: 'Jewellery / Luxury Gift Shop', icon: 'Gem', badge: 'Prestige', description: 'Gold/diamond showcases, bridal collections & custom enquiry funnel', popular: false, enabled: true, order: 11 },
    { id: 'showroom', name: 'Car / Bike Showroom & Service', icon: 'Car', badge: 'Automotive', description: 'Vehicle inventory, EMI calculators, test drive & service appointment booking', popular: false, enabled: true, order: 12 },
    { id: 'custom', name: 'Other / Custom Business Website', icon: 'Layers', badge: 'Bespoke', description: 'Custom software, multi-vendor marketplace, SaaS or bespoke enterprise build', popular: false, enabled: true, order: 13 }
  ],
  steps: [
    { id: 'step_type', stepNumber: 1, title: 'Category & Vision', subtitle: 'Select your business category to load tailored features', icon: 'Globe', enabled: true, order: 1 },
    { id: 'step_client', stepNumber: 2, title: 'Business Profile', subtitle: 'Contact information and brand profile', icon: 'User', enabled: true, order: 2 },
    { id: 'step_business', stepNumber: 3, title: 'Industry Specs', subtitle: 'Category-specific parameters and operational details', icon: 'Building', enabled: true, order: 3 },
    { id: 'step_pages', stepNumber: 4, title: 'Pages & Sitemaps', subtitle: 'Choose website pages and section structure', icon: 'Layout', enabled: true, order: 4 },
    { id: 'step_functionality', stepNumber: 5, title: 'Features & Logic', subtitle: 'Interactive capabilities, booking and lead magnets', icon: 'Zap', enabled: true, order: 5 },
    { id: 'step_payment', stepNumber: 6, title: 'Payment Gateways', subtitle: 'Online payment gateways and checkout methods', icon: 'CreditCard', enabled: true, order: 6 },
    { id: 'step_admin', stepNumber: 7, title: 'Admin CMS', subtitle: 'Content management and administrative control', icon: 'Shield', enabled: true, order: 7 },
    { id: 'step_communication', stepNumber: 8, title: 'WhatsApp & Email Alerts', subtitle: 'Instant notification channels and chat widgets', icon: 'MessageSquare', enabled: true, order: 8 },
    { id: 'step_design', stepNumber: 9, title: 'Design & Colors', subtitle: 'Visual theme, color palettes and style inspirations', icon: 'Palette', enabled: true, order: 9 },
    { id: 'step_photos', stepNumber: 10, title: 'Store Photos & Media', subtitle: 'Upload brand assets, store photos and menus', icon: 'Image', enabled: true, order: 10 },
    { id: 'step_budget', stepNumber: 11, title: 'Domain, Hosting & Budget', subtitle: 'Web addresses, cloud setup, budget and timeline', icon: 'Clock', enabled: true, order: 11 },
    { id: 'step_review', stepNumber: 12, title: 'Review & Submit', subtitle: 'AI Executive summary, coupon and confirmation', icon: 'CheckCircle', enabled: true, order: 12 }
  ],
  questions: [
    // ==========================================
    // STEP 1: CATEGORY & VISION (step_type)
    // ==========================================
    {
      id: 'q_website_type',
      stepId: 'step_type',
      categoryId: 'all',
      title: 'What Type of Website or Business are We Building?',
      label: 'Business Industry Category *',
      inputLabel: 'Business Industry Category *',
      description: 'Select your business category to instantly load industry-specific questions, live demo templates, and custom features.',
      helperText: 'Choose from 13 tailored business categories or select custom business.',
      type: 'radio',
      defaultValue: 'restaurant',
      defaultSelected: 'restaurant',
      required: true,
      order: 1,
      enabled: true,
      options: [
        { id: 'opt_cat_restaurant', label: 'Restaurant & Dining (Table booking, digital menus, delivery)', value: 'restaurant' },
        { id: 'opt_cat_cafe', label: 'Café & Bakery (Aesthetic lookbook, cake pre-orders, pickup)', value: 'cafe' },
        { id: 'opt_cat_salon', label: 'Salon & Spa (Service rate-cards, stylist booking)', value: 'salon' },
        { id: 'opt_cat_gym', label: 'Gym & Fitness (Memberships, trainer roster, trial pass)', value: 'gym' },
        { id: 'opt_cat_hotel', label: 'Hotel & Luxury Resort (Room booking engine, 360 tour)', value: 'hotel' },
        { id: 'opt_cat_real_estate', label: 'Real Estate & Properties (Property search, EMI calculator)', value: 'real_estate' },
        { id: 'opt_cat_photography', label: 'Photography & Studio (High-res portfolio albums, booking)', value: 'photography' },
        { id: 'opt_cat_boutique', label: 'Boutique & Fashion (Product catalog, online checkout)', value: 'boutique' },
        { id: 'opt_cat_coaching', label: 'Coaching & EdTech / LMS (Video courses, student login)', value: 'coaching' },
        { id: 'opt_cat_clinic', label: 'Clinic & Healthcare (Doctor OPD booking, specialties)', value: 'clinic' },
        { id: 'opt_cat_jewellery', label: 'Jewellery & Luxury (Bridal collection, custom enquiry)', value: 'jewellery' },
        { id: 'opt_cat_showroom', label: 'Car & Bike Showroom (Vehicle inventory, test drive)', value: 'showroom' },
        { id: 'opt_cat_custom', label: 'Other Custom Business (Bespoke architecture, custom app)', value: 'custom' }
      ]
    },

    // ==========================================
    // STEP 2: BUSINESS PROFILE & CONTACT (step_client)
    // ==========================================
    {
      id: 'q_business_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'What is your Business / Brand Name?',
      label: 'Business / Brand Name *',
      inputLabel: 'Business / Brand Name *',
      placeholder: 'e.g. Royal Bengal Sweets / Urban Loom Boutique',
      description: 'Your registered business or trade name as you want it displayed across header, footer, and invoices.',
      helperText: 'Will appear on top navigation and client receipts.',
      type: 'text',
      defaultValue: '',
      defaultSelected: '',
      required: true,
      order: 2,
      enabled: true
    },
    {
      id: 'q_owner_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Founder / Owner / Decision Maker Name',
      label: 'Owner / Founder Name *',
      inputLabel: 'Owner / Founder Name *',
      placeholder: 'e.g. Ananya Sen / Rahul Sharma',
      description: 'Primary contact person for project coordination, design sign-off, and milestone updates.',
      helperText: 'Direct contact for our lead developer.',
      type: 'text',
      defaultValue: '',
      defaultSelected: '',
      required: true,
      order: 3,
      enabled: true
    },
    {
      id: 'q_mobile',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Direct WhatsApp / Mobile Number',
      label: 'WhatsApp / Mobile Number *',
      inputLabel: 'WhatsApp / Mobile Number *',
      placeholder: 'e.g. 9876543210',
      description: 'We will send instant development updates, live preview links, and payment milestone receipts here.',
      helperText: 'Enter 10-digit mobile number.',
      type: 'phone',
      defaultValue: '',
      defaultSelected: '',
      required: true,
      order: 4,
      enabled: true
    },
    {
      id: 'q_email',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Official / Business Email Address',
      label: 'Business / Personal Email *',
      inputLabel: 'Business / Personal Email *',
      placeholder: 'e.g. contact@yourbrand.com',
      description: 'Invoices, requirement documentation, admin login credentials, and domain DNS access will be emailed here.',
      helperText: 'A valid email address for administrative notices.',
      type: 'email',
      defaultValue: '',
      defaultSelected: '',
      required: true,
      order: 5,
      enabled: true
    },
    {
      id: 'q_city_state',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Operating City & Location',
      label: 'City / Operating Location *',
      inputLabel: 'City / Operating Location *',
      placeholder: 'e.g. Kolkata, West Bengal / Mumbai, Maharashtra',
      description: 'Helps us configure your local SEO schema tags, Google Map pin, and local currency currency format.',
      helperText: 'e.g. City, State',
      type: 'text',
      defaultValue: '',
      defaultSelected: '',
      required: true,
      order: 6,
      enabled: true
    },
    {
      id: 'q_existing_website',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Existing Website URL (if any)',
      label: 'Existing Website URL (Optional)',
      inputLabel: 'Existing Website URL',
      placeholder: 'e.g. https://myoldwebsite.com (leave blank if new)',
      description: 'If you already have a website you wish to redesign, provide the link so we can migrate your content.',
      helperText: 'Leave empty if starting from scratch.',
      type: 'url',
      defaultValue: '',
      defaultSelected: '',
      required: false,
      order: 7,
      enabled: true
    },
    {
      id: 'q_has_logo',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Do you have a high-resolution logo ready?',
      label: 'Brand Logo Status',
      inputLabel: 'Brand Logo Status',
      description: 'Let us know if you already have a logo or need our creative branding team to design one for you.',
      type: 'radio',
      defaultValue: 'yes',
      defaultSelected: 'yes',
      required: true,
      order: 8,
      enabled: true,
      options: [
        { id: 'logo_yes', label: 'Yes, High-Res Vector/PNG Logo Ready', value: 'yes' },
        { id: 'logo_no', label: 'No, Need LOCAL2BRAND to Design Logo', value: 'no' },
        { id: 'logo_redesign', label: 'Have Old Logo, Need Modern Refresh', value: 'need_redesign' }
      ]
    },
    {
      id: 'q_content_ready',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Do you have photos and written content ready?',
      label: 'Content & Media Status',
      inputLabel: 'Content & Media Status',
      description: 'Let us know if your text, product descriptions, and photos are prepared or if you need our copywriting service.',
      type: 'radio',
      defaultValue: 'yes',
      defaultSelected: 'yes',
      required: true,
      order: 9,
      enabled: true,
      options: [
        { id: 'content_yes', label: 'Yes, Photos & Menu/Catalog Ready', value: 'yes' },
        { id: 'content_partial', label: 'Partially Ready (Need Copywriting / Stock Media)', value: 'partially' },
        { id: 'content_no', label: 'No, Need End-to-End Content Creation', value: 'no' }
      ]
    },

    // ==========================================
    // STEP 3: INDUSTRY SPECS (step_business)
    // ==========================================
    // 1. Restaurant
    {
      id: 'q_rest_specialties',
      stepId: 'step_business',
      categoryId: 'restaurant',
      title: 'Signature Dishes, Cuisines & Specialties',
      label: 'Signature Cuisines & Best Sellers *',
      inputLabel: 'Signature Cuisines & Best Sellers *',
      placeholder: 'e.g. Awadhi Dum Biryani, Mutton Kosha, Tandoori Platters, Gourmet Mocktails',
      description: 'Highlight your top offerings to be featured prominently on the digital menu and hero banner.',
      type: 'text',
      defaultValue: 'Dum Biryani, Mughlai Gravies, Tandoori Platters, Signature Desserts',
      defaultSelected: 'Dum Biryani, Mughlai Gravies, Tandoori Platters, Signature Desserts',
      required: true,
      order: 10,
      enabled: true
    },
    {
      id: 'q_rest_hours',
      stepId: 'step_business',
      categoryId: 'restaurant',
      title: 'Operating Hours & Service Shifts',
      label: 'Opening & Closing Hours',
      inputLabel: 'Opening & Closing Hours',
      placeholder: 'e.g. 11:30 AM – 11:00 PM (Monday – Sunday)',
      description: 'Displayed on footer, Google search results, and online table reservation calendar.',
      type: 'text',
      defaultValue: '11:00 AM – 11:30 PM (All 7 Days)',
      defaultSelected: '11:00 AM – 11:30 PM (All 7 Days)',
      required: false,
      order: 11,
      enabled: true
    },
    {
      id: 'q_rest_booking',
      stepId: 'step_business',
      categoryId: 'restaurant',
      title: 'Table Booking & Delivery Funnels',
      label: 'Select Reservation & Ordering Modules',
      inputLabel: 'Select Reservation & Ordering Modules',
      type: 'multi_select',
      defaultValue: 'table_booking,whatsapp_takeaway',
      defaultSelected: 'table_booking,whatsapp_takeaway',
      required: false,
      order: 12,
      enabled: true,
      options: [
        { id: 'res_table_booking', label: 'Online Table Reservation Calendar', value: 'table_booking' },
        { id: 'res_whatsapp_orders', label: 'Instant WhatsApp Takeaway Ordering', value: 'whatsapp_takeaway' },
        { id: 'res_chef_specials', label: 'Chef Signature Specials Showcase', value: 'chef_specials' },
        { id: 'res_zomato_swiggy', label: 'Zomato & Swiggy Direct Hub Links', value: 'delivery_partners' }
      ]
    },

    // 2. Cafe & Bakery
    {
      id: 'q_cafe_features',
      stepId: 'step_business',
      categoryId: 'cafe',
      title: 'Café Signature Menu & Lookbook Setup',
      label: 'Café Digital Modules',
      inputLabel: 'Café Digital Modules',
      type: 'multi_select',
      defaultValue: 'visual_menu,cake_preorder',
      defaultSelected: 'visual_menu,cake_preorder',
      required: false,
      order: 20,
      enabled: true,
      options: [
        { id: 'cafe_aesthetic_menu', label: 'Aesthetic Visual Food & Beverage Lookbook', value: 'visual_menu' },
        { id: 'cafe_cake_preorder', label: 'Custom Birthday / Event Cake Pre-Orders', value: 'cake_preorder' },
        { id: 'cafe_takeout', label: 'Direct Counter Pickup Ordering', value: 'counter_pickup' },
        { id: 'cafe_insta', label: 'Live Instagram Feed Embed', value: 'insta_embed' }
      ]
    },

    // 3. Salon & Spa
    {
      id: 'q_salon_features',
      stepId: 'step_business',
      categoryId: 'salon',
      title: 'Salon Services & Stylist Booking',
      label: 'Salon & Spa Modules',
      inputLabel: 'Salon & Spa Modules',
      type: 'multi_select',
      defaultValue: 'rate_card,slot_booking',
      defaultSelected: 'rate_card,slot_booking',
      required: false,
      order: 30,
      enabled: true,
      options: [
        { id: 'salon_stylist_roster', label: 'Stylist Roster & Portfolios', value: 'stylist_portfolio' },
        { id: 'salon_rate_card', label: 'Interactive Service Rate-Card with Duration', value: 'rate_card' },
        { id: 'salon_slot_booking', label: 'VIP Online Appointment Slot Booking', value: 'slot_booking' },
        { id: 'salon_bridal', label: 'Bridal & Party Package Showcase', value: 'bridal_packages' }
      ]
    },

    // 4. Gym & Fitness
    {
      id: 'q_gym_features',
      stepId: 'step_business',
      categoryId: 'gym',
      title: 'Fitness Hub Features & Memberships',
      label: 'Gym & Crossfit Modules',
      inputLabel: 'Gym & Crossfit Modules',
      type: 'multi_select',
      defaultValue: 'tier_pricing,trial_pass',
      defaultSelected: 'tier_pricing,trial_pass',
      required: false,
      order: 40,
      enabled: true,
      options: [
        { id: 'gym_tiers', label: 'Monthly / Annual Membership Tier Pricing Grid', value: 'tier_pricing' },
        { id: 'gym_trial_pass', label: '1-Day Free Trial Pass Lead Capture', value: 'trial_pass' },
        { id: 'gym_trainer_roster', label: 'Certified Trainer Profiles & Achievements', value: 'trainers' },
        { id: 'gym_timetable', label: 'Weekly Live Class & Batch Timetable', value: 'class_timetable' }
      ]
    },

    // 5. Hotel & Resort
    {
      id: 'q_hotel_features',
      stepId: 'step_business',
      categoryId: 'hotel',
      title: 'Resort & Room Showcase Capabilities',
      label: 'Hotel & Stay Modules',
      inputLabel: 'Hotel & Stay Modules',
      type: 'multi_select',
      defaultValue: 'room_grid,direct_booking',
      defaultSelected: 'room_grid,direct_booking',
      required: false,
      order: 50,
      enabled: true,
      options: [
        { id: 'hotel_room_categories', label: 'Room Categories & Tariff Grid', value: 'room_grid' },
        { id: 'hotel_360_tour', label: 'Virtual 360 Suite Tour / Gallery Embed', value: 'virtual_tour' },
        { id: 'hotel_booking_inquiry', label: 'Direct Room Booking & Date Selection Engine', value: 'direct_booking' },
        { id: 'hotel_amenities', label: 'Amenities & Local Sightseeing Guide', value: 'amenities_guide' }
      ]
    },

    // 6. Real Estate
    {
      id: 'q_re_features',
      stepId: 'step_business',
      categoryId: 'real_estate',
      title: 'Property Portal & Broker Lead Funnels',
      label: 'Real Estate Modules',
      inputLabel: 'Real Estate Modules',
      type: 'multi_select',
      defaultValue: 'property_search,site_visit',
      defaultSelected: 'property_search,site_visit',
      required: false,
      order: 60,
      enabled: true,
      options: [
        { id: 're_property_search', label: 'Interactive Property Search & Filters', value: 'property_search' },
        { id: 're_floor_plans', label: 'High-Res Floor Plans & Brochure Downloads', value: 'floor_plans' },
        { id: 're_emi_calc', label: 'Home Loan & EMI Calculator', value: 'emi_calculator' },
        { id: 're_site_visit', label: 'Instant Site Visit Booking Lead Capture', value: 'site_visit' }
      ]
    },

    // 7. Boutique Fashion
    {
      id: 'q_boutique_features',
      stepId: 'step_business',
      categoryId: 'boutique',
      title: 'E-Commerce & Fashion Store Capabilities',
      label: 'E-Commerce Features',
      inputLabel: 'E-Commerce Features',
      type: 'multi_select',
      defaultValue: 'product_catalog,online_checkout,whatsapp_buy',
      defaultSelected: 'product_catalog,online_checkout,whatsapp_buy',
      required: false,
      order: 70,
      enabled: true,
      options: [
        { id: 'ecom_catalog', label: 'Full Product Catalog with Size/Color Variants', value: 'product_catalog' },
        { id: 'ecom_checkout', label: 'Instant Payment Gateway (Razorpay/Stripe/UPI)', value: 'online_checkout' },
        { id: 'ecom_whatsapp_buy', label: '1-Click WhatsApp Direct Ordering', value: 'whatsapp_buy' },
        { id: 'ecom_tracking', label: 'Order Tracking & Automated Courier Sync', value: 'courier_tracking' }
      ]
    },

    // 8. Coaching / LMS
    {
      id: 'q_lms_courses',
      stepId: 'step_business',
      categoryId: 'coaching',
      title: 'Course Format & Delivery Methods',
      label: 'EdTech & LMS Modules',
      inputLabel: 'EdTech & LMS Modules',
      type: 'multi_select',
      defaultValue: 'video_courses,pdf_notes',
      defaultSelected: 'video_courses,pdf_notes',
      required: false,
      order: 80,
      enabled: true,
      options: [
        { id: 'lms_pre_recorded', label: 'Pre-Recorded Video Courses (Curriculum Player)', value: 'video_courses' },
        { id: 'lms_live_classes', label: 'Live Zoom / Google Meet Batch Integration', value: 'live_batches' },
        { id: 'lms_pdf_notes', label: 'Downloadable PDF Notes & Study Materials', value: 'pdf_notes' },
        { id: 'lms_quizzes', label: 'Online Quizzes & Auto Certificate Generation', value: 'quiz_certs' }
      ]
    },

    // Universal Custom Notes for All
    {
      id: 'q_custom_user_notes',
      stepId: 'step_business',
      categoryId: 'all',
      title: 'Special Custom Requirements & Specific Feature Requests',
      label: 'Specific Feature Details or Requests',
      inputLabel: 'Specific Feature Details or Requests',
      placeholder: 'Describe any specific features, third-party software, custom calculator, API integration, or design preferences...',
      description: 'Have anything specific in mind? Our developers will review and incorporate it into the architecture.',
      type: 'textarea',
      defaultValue: '',
      defaultSelected: '',
      required: false,
      order: 99,
      enabled: true
    },

    // ==========================================
    // STEP 4: PAGES & SITEMAPS (step_pages)
    // ==========================================
    {
      id: 'q_selected_pages',
      stepId: 'step_pages',
      categoryId: 'all',
      title: 'Which Pages and Sitemaps do you want in your Website?',
      label: 'Select Pages to Build *',
      inputLabel: 'Select Pages to Build *',
      description: 'Choose all core pages you want structured for high search ranking and conversion.',
      helperText: 'Select at least 1 page.',
      type: 'multi_select',
      defaultValue: 'Home Page (High-Converting Hero), Services / Food Menu / Product Catalog, Online Booking / Reservation System, Contact Page & Google Map Integration, Customer Reviews & Testimonials',
      defaultSelected: 'Home Page (High-Converting Hero), Services / Food Menu / Product Catalog, Online Booking / Reservation System, Contact Page & Google Map Integration, Customer Reviews & Testimonials',
      required: true,
      order: 100,
      enabled: true,
      options: [
        { id: 'p_home', label: 'Home Page (High-Converting Hero)', value: 'Home Page (High-Converting Hero)' },
        { id: 'p_about', label: 'About Us / Brand Story', value: 'About Us / Brand Story' },
        { id: 'p_services', label: 'Services / Food Menu / Product Catalog', value: 'Services / Food Menu / Product Catalog' },
        { id: 'p_booking', label: 'Online Booking / Reservation System', value: 'Online Booking / Reservation System' },
        { id: 'p_gallery', label: 'Gallery / High-Res Portfolio Lookbook', value: 'Gallery / High-Res Portfolio Lookbook' },
        { id: 'p_pricing', label: 'Pricing & Membership Rate Cards', value: 'Pricing & Membership Rate Cards' },
        { id: 'p_reviews', label: 'Customer Reviews & Testimonials', value: 'Customer Reviews & Testimonials' },
        { id: 'p_blog', label: 'Blog / News & Articles Section', value: 'Blog / News & Articles Section' },
        { id: 'p_contact', label: 'Contact Page & Google Map Integration', value: 'Contact Page & Google Map Integration' },
        { id: 'p_faq', label: 'Frequently Asked Questions (FAQ)', value: 'Frequently Asked Questions (FAQ)' },
        { id: 'p_legal', label: 'Terms, Privacy Policy & Refund Policy', value: 'Terms, Privacy Policy & Refund Policy' }
      ]
    },

    // ==========================================
    // STEP 5: FEATURES & LOGIC (step_functionality)
    // ==========================================
    {
      id: 'q_selected_features',
      stepId: 'step_functionality',
      categoryId: 'all',
      title: 'Which Functional Modules & Capabilities do you need?',
      label: 'Select Key Features & Modules *',
      inputLabel: 'Select Key Features & Modules *',
      description: 'Supercharge your website with interactive functionality, booking engines, and automated alerts.',
      helperText: 'Select at least 1 feature.',
      type: 'multi_select',
      defaultValue: 'User Registration / Customer Login, Online Table / Appointment Booking, Automated WhatsApp Lead Notifications',
      defaultSelected: 'User Registration / Customer Login, Online Table / Appointment Booking, Automated WhatsApp Lead Notifications',
      required: true,
      order: 110,
      enabled: true,
      options: [
        { id: 'f_user_login', label: 'User Registration / Customer Login', value: 'User Registration / Customer Login' },
        { id: 'f_booking', label: 'Online Table / Appointment Booking', value: 'Online Table / Appointment Booking' },
        { id: 'f_whatsapp_alerts', label: 'Automated WhatsApp Lead Notifications', value: 'Automated WhatsApp Lead Notifications' },
        { id: 'f_coupons', label: 'Discount Coupon & Promotional Code System', value: 'Discount Coupon & Promotional Code System' },
        { id: 'f_live_chat', label: 'Live Chat Widget (Tawk.to / WhatsApp)', value: 'Live Chat Widget (Tawk.to / WhatsApp)' },
        { id: 'f_multicurrency', label: 'Multi-Currency & International Switching', value: 'Multi-Currency & International Switching' },
        { id: 'f_darkmode', label: 'Dark / Light Mode Theme Switching', value: 'Dark / Light Mode Theme Switching' },
        { id: 'f_seo', label: 'SEO Meta Tags & Google Analytics Tracking', value: 'SEO Meta Tags & Google Analytics Tracking' },
        { id: 'f_popups', label: 'Push Notifications & Lead Magnet Popups', value: 'Push Notifications & Lead Magnet Popups' },
        { id: 'f_invoices', label: 'Automated PDF Invoicing & GST Receipts', value: 'Automated PDF Invoicing & GST Receipts' }
      ]
    },

    // ==========================================
    // STEP 6: PAYMENT GATEWAYS (step_payment)
    // ==========================================
    {
      id: 'q_payment_methods',
      stepId: 'step_payment',
      categoryId: 'all',
      title: 'How would you like your customers to pay?',
      label: 'Supported Payment Gateways *',
      inputLabel: 'Supported Payment Gateways *',
      description: 'Enable instant online payments with zero technical setup hassle.',
      helperText: 'Select at least 1 payment method.',
      type: 'multi_select',
      defaultValue: 'Razorpay (Cards, Netbanking, UPI), UPI (GPay / PhonePe / Paytm Instant QR), Cash on Delivery (COD) / Pay at Venue',
      defaultSelected: 'Razorpay (Cards, Netbanking, UPI), UPI (GPay / PhonePe / Paytm Instant QR), Cash on Delivery (COD) / Pay at Venue',
      required: true,
      order: 120,
      enabled: true,
      options: [
        { id: 'pay_razorpay', label: 'Razorpay (Cards, Netbanking, UPI)', value: 'Razorpay (Cards, Netbanking, UPI)' },
        { id: 'pay_upi', label: 'UPI (GPay / PhonePe / Paytm Instant QR)', value: 'UPI (GPay / PhonePe / Paytm Instant QR)' },
        { id: 'pay_cod', label: 'Cash on Delivery (COD) / Pay at Venue', value: 'Cash on Delivery (COD) / Pay at Venue' },
        { id: 'pay_stripe', label: 'Stripe (International Credit/Debit Cards)', value: 'Stripe (International Credit/Debit Cards)' },
        { id: 'pay_phonepe', label: 'PhonePe / Paytm Payment Gateway', value: 'PhonePe / Paytm Payment Gateway' },
        { id: 'pay_bank', label: 'Bank Transfer (NEFT / RTGS / IMPS Manual)', value: 'Bank Transfer (NEFT / RTGS / IMPS Manual)' }
      ]
    },

    // ==========================================
    // STEP 7: ADMIN CMS (step_admin)
    // ==========================================
    {
      id: 'q_admin_panel_type',
      stepId: 'step_admin',
      categoryId: 'all',
      title: 'What level of Admin Control and CMS do you require?',
      label: 'Admin Control Panel Option *',
      inputLabel: 'Admin Control Panel Option *',
      description: 'Choose whether you want full self-service control or fully managed updates by our team.',
      type: 'radio',
      defaultValue: 'Full Dynamic Admin Panel',
      defaultSelected: 'Full Dynamic Admin Panel',
      required: true,
      order: 130,
      enabled: true,
      options: [
        { id: 'adm_full', label: 'Full Dynamic Admin Panel (Manage products, orders, bookings, customers & analytics)', value: 'Full Dynamic Admin Panel' },
        { id: 'adm_simple', label: 'Simple Content Editor (Easily update menu prices, gallery photos & text)', value: 'Simple Content Editor' },
        { id: 'adm_static', label: 'No Admin Panel / Static Website (All updates managed by LOCAL2BRAND team)', value: 'No Admin Panel / Static Website' }
      ]
    },

    // ==========================================
    // STEP 8: WHATSAPP & EMAIL ALERTS (step_communication)
    // ==========================================
    {
      id: 'q_whatsapp_options',
      stepId: 'step_communication',
      categoryId: 'all',
      title: 'WhatsApp Lead & Order Integration Options',
      label: 'WhatsApp Features',
      inputLabel: 'WhatsApp Features',
      description: 'Direct customers straight to your WhatsApp business account with 1-click convenience.',
      type: 'multi_select',
      defaultValue: 'WhatsApp Floating Quick Chat Button, Direct Order / Booking to WhatsApp with Pre-filled Payload',
      defaultSelected: 'WhatsApp Floating Quick Chat Button, Direct Order / Booking to WhatsApp with Pre-filled Payload',
      required: false,
      order: 140,
      enabled: true,
      options: [
        { id: 'wa_floating', label: 'WhatsApp Floating Quick Chat Button', value: 'WhatsApp Floating Quick Chat Button' },
        { id: 'wa_direct_order', label: 'Direct Order / Booking to WhatsApp with Pre-filled Payload', value: 'Direct Order / Booking to WhatsApp with Pre-filled Payload' },
        { id: 'wa_admin_alert', label: 'Automated WhatsApp Lead Notification to Admin Phone', value: 'Automated WhatsApp Lead Notification to Admin Phone' }
      ]
    },
    {
      id: 'q_email_options',
      stepId: 'step_communication',
      categoryId: 'all',
      title: 'Automated Email Notifications & Receipts',
      label: 'Email Services',
      inputLabel: 'Email Services',
      description: 'Keep your customers and management loop informed with instant SMTP email dispatches.',
      type: 'multi_select',
      defaultValue: 'Automated Customer Confirmation Email & Receipt, Instant Admin Email Alert for every submission',
      defaultSelected: 'Automated Customer Confirmation Email & Receipt, Instant Admin Email Alert for every submission',
      required: false,
      order: 141,
      enabled: true,
      options: [
        { id: 'em_customer_receipt', label: 'Automated Customer Confirmation Email & Receipt', value: 'Automated Customer Confirmation Email & Receipt' },
        { id: 'em_admin_alert', label: 'Instant Admin Email Alert for every submission', value: 'Instant Admin Email Alert for every submission' },
        { id: 'em_weekly_digest', label: 'Weekly Analytics & Lead Digest Email', value: 'Weekly Analytics & Lead Digest Email' }
      ]
    },

    // ==========================================
    // STEP 9: DESIGN & COLORS (step_design)
    // ==========================================
    {
      id: 'q_design_style',
      stepId: 'step_design',
      categoryId: 'all',
      title: 'Visual Design Aesthetic & Theme Personality',
      label: 'Preferred Visual Style',
      inputLabel: 'Preferred Visual Style',
      description: 'Help our UI/UX designers create a bespoke digital experience aligned with your brand.',
      type: 'radio',
      defaultValue: 'Modern Glassmorphic & Vibrant',
      defaultSelected: 'Modern Glassmorphic & Vibrant',
      required: false,
      order: 150,
      enabled: true,
      options: [
        { id: 'sty_glass', label: 'Modern Glassmorphic & Vibrant (Gradient accents, glass cards, high conversion)', value: 'Modern Glassmorphic & Vibrant' },
        { id: 'sty_minimal', label: 'Minimalist Clean Luxury (Ample white space, elegant typography)', value: 'Minimalist Clean Luxury' },
        { id: 'sty_neon', label: 'Dark Cyber Neon & High-Tech (Deep slate black, neon glowing highlights)', value: 'Dark Cyber Neon & High-Tech' },
        { id: 'sty_bold', label: 'Bold High-Energy & Punchy (High contrast, vibrant typography)', value: 'Bold High-Energy & Punchy' }
      ]
    },
    {
      id: 'q_preferred_colors',
      stepId: 'step_design',
      categoryId: 'all',
      title: 'Preferred Brand Colors & Palette',
      label: 'Brand Color Preferences',
      inputLabel: 'Brand Color Preferences',
      placeholder: 'e.g. Purple & Gold, Royal Blue & White, Emerald Green & Warm Gold',
      description: 'Specify colors you like or want matched from your physical store or logo.',
      type: 'text',
      defaultValue: 'Purple, Neon Blue & Luxury Gold',
      defaultSelected: 'Purple, Neon Blue & Luxury Gold',
      required: false,
      order: 151,
      enabled: true
    },
    {
      id: 'q_reference_urls',
      stepId: 'step_design',
      categoryId: 'all',
      title: 'Inspirational or Competitor Website URLs',
      label: 'Reference Website URLs (Optional)',
      inputLabel: 'Reference Website URLs (Optional)',
      placeholder: 'e.g. https://apple.com, https://airbnb.com (websites whose layout, look, or structure you like)',
      description: 'Share links to websites whose design or animation you find impressive.',
      type: 'textarea',
      defaultValue: '',
      defaultSelected: '',
      required: false,
      order: 152,
      enabled: true
    },

    // ==========================================
    // STEP 10: STORE PHOTOS & MEDIA (step_photos)
    // ==========================================
    {
      id: 'q_store_photos',
      stepId: 'step_photos',
      categoryId: 'all',
      title: 'Store Exterior, Dishes, Products, or Logo Photos',
      label: 'Brand Media Upload (Up to 20 photos)',
      inputLabel: 'Brand Media Upload (Up to 20 photos)',
      description: 'Attach clear JPG/PNG photos of your establishment, dishes, staff, or banners. These will be automatically synced with Cloudinary.',
      helperText: 'Max 20 photos. Supported formats: JPG, PNG, WEBP.',
      type: 'file',
      defaultValue: '',
      defaultSelected: '',
      required: false,
      order: 160,
      enabled: true
    },

    // ==========================================
    // STEP 11: DOMAIN, HOSTING, BUDGET & TIMELINE (step_budget)
    // ==========================================
    {
      id: 'q_domain_status',
      stepId: 'step_budget',
      categoryId: 'all',
      title: 'Domain Name Status',
      label: 'Domain Status',
      inputLabel: 'Domain Status',
      type: 'radio',
      defaultValue: 'Need New Domain (Free Included)',
      defaultSelected: 'Need New Domain (Free Included)',
      required: false,
      order: 170,
      enabled: true,
      options: [
        { id: 'dom_need_new', label: 'Need New Domain (Free Included)', value: 'Need New Domain (Free Included)' },
        { id: 'dom_own', label: 'Already Own Domain (.com / .in / .org)', value: 'Already Own Domain (.com / .in / .org)' },
        { id: 'dom_multi', label: 'Need Multiple Domains & Subdomains', value: 'Need Multiple Domains & Subdomains' }
      ]
    },
    {
      id: 'q_hosting_status',
      stepId: 'step_budget',
      categoryId: 'all',
      title: 'Cloud Hosting Preference',
      label: 'Cloud Hosting Status',
      inputLabel: 'Cloud Hosting Status',
      type: 'radio',
      defaultValue: 'High-Speed Cloud Hosting (Free 1-Yr Included)',
      defaultSelected: 'High-Speed Cloud Hosting (Free 1-Yr Included)',
      required: false,
      order: 171,
      enabled: true,
      options: [
        { id: 'host_free', label: 'High-Speed Cloud Hosting (Free 1-Yr Included)', value: 'High-Speed Cloud Hosting (Free 1-Yr Included)' },
        { id: 'host_client', label: 'Deploy to Client\'s Existing AWS / Vercel / Hostinger / cPanel', value: 'Deploy to Client\'s Existing AWS / Vercel / Hostinger / cPanel' },
        { id: 'host_dedicated', label: 'Dedicated Managed Cloud Server with Daily Backups', value: 'Dedicated Managed Cloud Server with Daily Backups' }
      ]
    },
    {
      id: 'q_budget_bracket',
      stepId: 'step_budget',
      categoryId: 'all',
      title: 'Estimated Investment Budget Bracket',
      label: 'Budget Bracket',
      inputLabel: 'Budget Bracket',
      type: 'radio',
      defaultValue: '₹12,999 – ₹24,999 (Standard Commercial)',
      defaultSelected: '₹12,999 – ₹24,999 (Standard Commercial)',
      required: false,
      order: 172,
      enabled: true,
      options: [
        { id: 'bud_starter', label: '₹4,999 – ₹9,999 (Starter Quick Launch)', value: '₹4,999 – ₹9,999 (Starter Quick Launch)' },
        { id: 'bud_standard', label: '₹12,999 – ₹24,999 (Standard Commercial)', value: '₹12,999 – ₹24,999 (Standard Commercial)' },
        { id: 'bud_advanced', label: '₹29,999 – ₹49,999 (Advanced Dynamic Store / Multi-Service)', value: '₹29,999 – ₹49,999 (Advanced Dynamic Store / Multi-Service)' },
        { id: 'bud_enterprise', label: '₹50,000+ (Bespoke Enterprise / SaaS / Mobile App Integration)', value: '₹50,000+ (Bespoke Enterprise / SaaS / Mobile App Integration)' }
      ]
    },
    {
      id: 'q_delivery_timeline',
      stepId: 'step_budget',
      categoryId: 'all',
      title: 'Target Delivery Speed & Timeline',
      label: 'Delivery Timeline',
      inputLabel: 'Delivery Timeline',
      type: 'radio',
      defaultValue: '⚡ Express Delivery (48 - 72 Hours)',
      defaultSelected: '⚡ Express Delivery (48 - 72 Hours)',
      required: false,
      order: 173,
      enabled: true,
      options: [
        { id: 'time_express', label: '⚡ Express Delivery (48 - 72 Hours)', value: '⚡ Express Delivery (48 - 72 Hours)' },
        { id: 'time_standard', label: 'Standard Delivery (4 - 7 Business Days)', value: 'Standard Delivery (4 - 7 Business Days)' },
        { id: 'time_sprint', label: 'Comprehensive Sprint (10 - 15 Days with Beta Revisions)', value: 'Comprehensive Sprint (10 - 15 Days with Beta Revisions)' }
      ]
    },

    // ==========================================
    // STEP 12: REVIEW & SUBMIT (step_review)
    // ==========================================
    {
      id: 'q_final_review',
      stepId: 'step_review',
      categoryId: 'all',
      title: 'AI Executive Project Scope, Roadmap & Coupon Confirmation',
      label: 'Proposal Review & Submission',
      inputLabel: 'Proposal Review & Submission',
      description: 'Review the instant AI executive scope summary, apply promotional discount coupons, and finalize proposal submission.',
      helperText: 'No upfront payment is charged upon submitting this requirement form.',
      type: 'text',
      defaultValue: '',
      defaultSelected: '',
      required: false,
      order: 180,
      enabled: true
    }
  ]
};
