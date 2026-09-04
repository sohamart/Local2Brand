export const defaultFormSchema = {
  name: 'Client Website Requirement & Onboarding Form',
  version: '1.0',
  versionNumber: 1,
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
    { id: 'coaching', name: 'Coaching / EdTech / Institute', icon: 'GraduationCap', badge: 'Education', description: 'Course catalogues, batch schedules, faculty profiles & admission forms', popular: false, enabled: true, order: 9 },
    { id: 'clinic', name: 'Clinic / Doctor / Healthcare', icon: 'Stethoscope', badge: 'Verified', description: 'Doctor bio, specialization, visiting hours & OPD consultation booking', popular: false, enabled: true, order: 10 },
    { id: 'jewellery', name: 'Jewellery / Luxury Gift Shop', icon: 'Gem', badge: 'Prestige', description: 'Gold/diamond showcases, bridal collections & custom enquiry funnel', popular: false, enabled: true, order: 11 },
    { id: 'showroom', name: 'Car / Bike Showroom & Service', icon: 'Car', badge: 'Automotive', description: 'Vehicle inventory, EMI calculators, test drive & service appointment booking', popular: false, enabled: true, order: 12 },
    { id: 'custom', name: 'Other / Custom Business Website', icon: 'Layers', badge: 'Bespoke', description: 'Custom software, multi-vendor marketplace, SaaS or bespoke enterprise build', popular: false, enabled: true, order: 13 }
  ],
  steps: [
    { id: 'step_type', stepNumber: 1, title: 'Website Type', subtitle: 'Select your business category', icon: 'Globe', enabled: true, order: 1 },
    { id: 'step_client', stepNumber: 2, title: 'Client & Brand Info', subtitle: 'Contact and basic brand presence', icon: 'User', enabled: true, order: 2 },
    { id: 'step_business', stepNumber: 3, title: 'Business Details', subtitle: 'Category-specific business specs', icon: 'Building', enabled: true, order: 3 },
    { id: 'step_pages', stepNumber: 4, title: 'Website Pages & Sections', subtitle: 'Choose pages to include in the build', icon: 'Layout', enabled: true, order: 4 },
    { id: 'step_functionality', stepNumber: 5, title: 'Functionality & Modules', subtitle: 'Interactive features and capabilities', icon: 'Zap', enabled: true, order: 5 },
    { id: 'step_payment', stepNumber: 6, title: 'Payment Methods', subtitle: 'Gateways and payment options', icon: 'CreditCard', enabled: true, order: 6 },
    { id: 'step_admin', stepNumber: 7, title: 'Admin Panel & CMS', subtitle: 'Manage orders, content and analytics', icon: 'Shield', enabled: true, order: 7 },
    { id: 'step_communication', stepNumber: 8, title: 'WhatsApp & Email Alerts', subtitle: 'Notifications and customer outreach', icon: 'MessageSquare', enabled: true, order: 8 },
    { id: 'step_design', stepNumber: 9, title: 'Design & Visual Identity', subtitle: 'Themes, palettes and references', icon: 'Palette', enabled: true, order: 9 },
    { id: 'step_hosting', stepNumber: 10, title: 'Domain & Hosting', subtitle: 'Web addresses and cloud setup', icon: 'Server', enabled: true, order: 10 },
    { id: 'step_budget', stepNumber: 11, title: 'Budget & Timeline', subtitle: 'Investment bracket and delivery speed', icon: 'Clock', enabled: true, order: 11 },
    { id: 'step_review', stepNumber: 12, title: 'Review & Submit', subtitle: 'Inspect summary and confirm requirements', icon: 'CheckCircle', enabled: true, order: 12 }
  ],
  questions: [
    // Step 2: Common Client Information
    {
      id: 'q_business_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Business / Brand Name',
      placeholder: 'e.g. Royal Bengal Sweets / Urban Loom',
      type: 'text',
      required: true,
      order: 1,
      enabled: true
    },
    {
      id: 'q_owner_name',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Owner / Founder Name',
      placeholder: 'e.g. Ananya Sen',
      type: 'text',
      required: true,
      order: 2,
      enabled: true
    },
    {
      id: 'q_mobile',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Direct WhatsApp / Mobile Number',
      placeholder: 'e.g. 9876543210',
      type: 'phone',
      required: true,
      order: 3,
      enabled: true
    },
    {
      id: 'q_email',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Business / Personal Email',
      placeholder: 'e.g. founder@brand.com',
      type: 'email',
      required: true,
      order: 4,
      enabled: true
    },
    {
      id: 'q_city_state',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'City & State',
      placeholder: 'e.g. Kolkata, West Bengal / Mumbai, Maharashtra',
      type: 'text',
      required: false,
      order: 5,
      enabled: true
    },
    {
      id: 'q_has_logo',
      stepId: 'step_client',
      categoryId: 'all',
      title: 'Do you already have a brand logo?',
      type: 'radio',
      required: true,
      order: 6,
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
      type: 'radio',
      required: true,
      order: 7,
      enabled: true,
      options: [
        { id: 'content_yes', label: 'Yes, All Photos & Text are Ready', value: 'yes' },
        { id: 'content_partial', label: 'Partially Ready (Need Copywriting / Stock Photography)', value: 'partially' },
        { id: 'content_no', label: 'No, Need End-to-End Content Creation', value: 'no' }
      ]
    },

    // Step 3: Category-Specific Business Details
    // 1. LMS & Courses / Coaching
    {
      id: 'q_lms_courses',
      stepId: 'step_business',
      categoryId: 'coaching',
      title: 'Course Format & Delivery Methods',
      type: 'multi_select',
      required: true,
      order: 10,
      enabled: true,
      options: [
        { id: 'lms_pre_recorded', label: 'Pre-Recorded Video Courses (Curriculum Player)', value: 'video_courses' },
        { id: 'lms_live_classes', label: 'Live Zoom / Google Meet Batch Integration', value: 'live_batches' },
        { id: 'lms_pdf_notes', label: 'Downloadable PDF Notes & Study Materials', value: 'pdf_notes' },
        { id: 'lms_quizzes', label: 'Online Quizzes & Auto Certificate Generation', value: 'quiz_certs' }
      ]
    },
    {
      id: 'q_lms_video_hosting',
      stepId: 'step_business',
      categoryId: 'coaching',
      title: 'Video Hosting Preference (Anti-Piracy)',
      type: 'select',
      required: false,
      order: 11,
      enabled: true,
      options: [
        { id: 'vh_encrypted', label: 'DRM Encrypted Secure Player (No Screen Recording/Download)', value: 'drm_secure' },
        { id: 'vh_vimeo', label: 'Vimeo OTT / Private Vimeo Embed', value: 'vimeo' },
        { id: 'vh_youtube', label: 'Unlisted YouTube Embed (Budget-Friendly)', value: 'youtube_unlisted' },
        { id: 'vh_cloudflare', label: 'Cloudflare Stream Direct CDN', value: 'cloudflare_stream' }
      ]
    },

    // 2. Restaurant / Fine Dining
    {
      id: 'q_rest_cuisines',
      stepId: 'step_business',
      categoryId: 'restaurant',
      title: 'Cuisines & Dining Experience',
      type: 'multi_select',
      required: true,
      order: 20,
      enabled: true,
      options: [
        { id: 'c_north_indian', label: 'North Indian & Mughlai', value: 'north_indian' },
        { id: 'c_bengali', label: 'Traditional Bengali Specials', value: 'bengali' },
        { id: 'c_chinese', label: 'Authentic Chinese & Asian', value: 'chinese' },
        { id: 'c_continental', label: 'Continental & Italian Pasta/Pizza', value: 'continental' },
        { id: 'c_biryani', label: 'Dum Biryani & Kebabs', value: 'biryani' },
        { id: 'c_desserts', label: 'Gourmet Desserts & Bakery', value: 'desserts' }
      ]
    },
    {
      id: 'q_rest_booking',
      stepId: 'step_business',
      categoryId: 'restaurant',
      title: 'Table Reservation & Takeaway Funnels',
      type: 'multi_select',
      required: true,
      order: 21,
      enabled: true,
      options: [
        { id: 'res_table_booking', label: 'Online Table Reservation Calendar', value: 'table_booking' },
        { id: 'res_whatsapp_orders', label: 'Instant WhatsApp Takeaway Ordering', value: 'whatsapp_takeaway' },
        { id: 'res_chef_specials', label: 'Chef Signature Specials Showcase', value: 'chef_specials' },
        { id: 'res_zomato_swiggy', label: 'Zomato & Swiggy Direct Hub Links', value: 'delivery_partners' }
      ]
    },

    // 3. Cafe & Bakery
    {
      id: 'q_cafe_features',
      stepId: 'step_business',
      categoryId: 'cafe',
      title: 'Café Signature Menu & Digital Setup',
      type: 'multi_select',
      required: true,
      order: 30,
      enabled: true,
      options: [
        { id: 'cafe_aesthetic_menu', label: 'Aesthetic Visual Food & Beverage Lookbook', value: 'visual_menu' },
        { id: 'cafe_cake_preorder', label: 'Custom Birthday / Event Cake Pre-Orders', value: 'cake_preorder' },
        { id: 'cafe_takeout', label: 'Direct Counter Pickup Ordering', value: 'counter_pickup' },
        { id: 'cafe_insta', label: 'Live Instagram Feed Embed', value: 'insta_embed' }
      ]
    },

    // 4. Salon & Spa
    {
      id: 'q_salon_features',
      stepId: 'step_business',
      categoryId: 'salon',
      title: 'Salon Services & Stylist Booking',
      type: 'multi_select',
      required: true,
      order: 40,
      enabled: true,
      options: [
        { id: 'salon_stylist_roster', label: 'Stylist Roster & Portfolios', value: 'stylist_portfolio' },
        { id: 'salon_rate_card', label: 'Interactive Service Rate-Card with Duration', value: 'rate_card' },
        { id: 'salon_slot_booking', label: 'VIP Online Appointment Slot Booking', value: 'slot_booking' },
        { id: 'salon_bridal', label: 'Bridal & Party Package Showcase', value: 'bridal_packages' }
      ]
    },

    // 5. Gym & Fitness
    {
      id: 'q_gym_features',
      stepId: 'step_business',
      categoryId: 'gym',
      title: 'Fitness Hub Features & Memberships',
      type: 'multi_select',
      required: true,
      order: 50,
      enabled: true,
      options: [
        { id: 'gym_tiers', label: 'Monthly / Annual Membership Tier Pricing Grid', value: 'tier_pricing' },
        { id: 'gym_trial_pass', label: '1-Day Free Trial Pass Lead Capture', value: 'trial_pass' },
        { id: 'gym_trainer_roster', label: 'Certified Trainer Profiles & Achievements', value: 'trainers' },
        { id: 'gym_timetable', label: 'Weekly Live Class & Batch Timetable', value: 'class_timetable' }
      ]
    },

    // 6. Hotel & Luxury Resort
    {
      id: 'q_hotel_features',
      stepId: 'step_business',
      categoryId: 'hotel',
      title: 'Resort & Room Showcase Capabilities',
      type: 'multi_select',
      required: true,
      order: 60,
      enabled: true,
      options: [
        { id: 'hotel_room_categories', label: 'Room Categories & Tariff Grid', value: 'room_grid' },
        { id: 'hotel_360_tour', label: 'Virtual 360 Suite Tour / Gallery Embed', value: 'virtual_tour' },
        { id: 'hotel_booking_inquiry', label: 'Direct Room Booking & Date Selection Engine', value: 'direct_booking' },
        { id: 'hotel_amenities', label: 'Amenities & Local Sightseeing Guide', value: 'amenities_guide' }
      ]
    },

    // 7. Real Estate
    {
      id: 'q_re_features',
      stepId: 'step_business',
      categoryId: 'real_estate',
      title: 'Property Portal & Broker Lead Funnels',
      type: 'multi_select',
      required: true,
      order: 70,
      enabled: true,
      options: [
        { id: 're_property_search', label: 'Interactive Property Search & Filters', value: 'property_search' },
        { id: 're_floor_plans', label: 'High-Res Floor Plans & Brochure Downloads', value: 'floor_plans' },
        { id: 're_emi_calc', label: 'Home Loan & EMI Calculator', value: 'emi_calculator' },
        { id: 're_site_visit', label: 'Instant Site Visit Booking Lead Capture', value: 'site_visit' }
      ]
    },

    // 8. E-Commerce & Boutique Fashion
    {
      id: 'q_boutique_features',
      stepId: 'step_business',
      categoryId: 'boutique',
      title: 'E-Commerce & Fashion Store Capabilities',
      type: 'multi_select',
      required: true,
      order: 80,
      enabled: true,
      options: [
        { id: 'ecom_catalog', label: 'Full Product Catalog with Size/Color Variants', value: 'product_catalog' },
        { id: 'ecom_checkout', label: 'Instant Payment Gateway (Razorpay/Stripe/UPI)', value: 'online_checkout' },
        { id: 'ecom_whatsapp_buy', label: '1-Click WhatsApp Direct Ordering', value: 'whatsapp_buy' },
        { id: 'ecom_tracking', label: 'Order Tracking & Automated Courier Sync', value: 'courier_tracking' }
      ]
    },

    // Universal Custom User Input Box for All Templates & Categories
    {
      id: 'q_custom_user_notes',
      stepId: 'step_business',
      categoryId: 'all',
      title: 'Special Custom Requirements & Specific Feature Requests',
      placeholder: 'Describe any specific features, third-party tools, custom design requests, or exact pages you want on your website...',
      type: 'textarea',
      required: false,
      order: 99,
      enabled: true
    }
  ]
};
