/**
 * Routini eWorld MLM - Module d'Internationalisation (i18n)
 * 4 Langues Officielles : Français (FR), Anglais (EN), Arabe (AR - RTL), Espagnol (ES)
 */

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('ROUTINI_LANG') || 'fr';
    this.translations = {
      fr: {
        langName: 'Français',
        flag: '🇲🇦',
        dir: 'ltr',
        // Navigation
        nav_dashboard: 'Tableau de Bord',
        nav_genealogy: 'Arbre Généalogique',
        nav_shop: 'Boutique Cosmétiques',
        nav_bonus: 'Commissions & E-Point',
        nav_sponsor: 'Nouveau Distributeur',
        nav_admin: 'Direction Générale',
        nav_client_orders: 'Mes Commandes & Livraisons',
        nav_client_loyalty: 'Mes Points Fidélité',
        nav_client_referral: 'Parrainage & Amis',
        nav_logout: 'Déconnexion',
        nav_change_profile: 'Changer de Profil',
        nav_main_title: 'Navigation Principale',
        nav_client_title: 'Espace Client',

        // Header
        header_title: 'Tableau de Bord eWorld',
        header_desc: 'Aperçu général de vos performances et qualifications Routini',
        header_change_account: 'Changer de Compte',
        wallet_balance: 'Solde Portefeuille',
        fidelity_points: 'Pts Fidélité',

        // Auth
        auth_title: 'Portail Sécurisé Intégré des Distributeurs & de la Direction Générale',
        auth_tab_client: 'Espace Client',
        auth_tab_distributor: 'Espace Distributeur',
        auth_tab_owner: 'Direction Générale',
        auth_id_numeric_label: 'Identifiant 100% Numérique (chiffres uniquement) :',
        auth_id_client_label: 'Code Client (chiffres) :',
        auth_id_admin_label: 'Identifiant Administrateur :',
        auth_id_placeholder: 'Ex: 818204921 (chiffres uniquement)',
        auth_password_label: 'Mot de passe :',
        auth_remember: 'Mémoriser mes identifiants',
        auth_submit_distrib: 'Connexion Espace Distributeur',
        auth_submit_client: 'Connexion Espace Client Privilège',
        auth_submit_admin: 'Connexion Direction Générale (Admin)',
        auth_new_client_title: 'Nouveau Client Privilège Routini ?',
        auth_new_client_desc: 'Commandez directement avec 10% de réduction et cumulez vos points fidélité !',
        auth_create_client_btn: 'Créer mon Compte Client (Gratuit)',

        // Metrics MLM
        metric_ppv: 'Points Personnels (PPV)',
        metric_gpv: 'Volume Équipe (PV)',
        metric_sv: 'Base Commissions (CV)',
        metric_wallet: 'Portefeuille E-Point',
        metric_active_distrib: 'Distributeur Actif Qualifié',
        metric_inactive_distrib: 'Distributeur Inactif (< seuil PV)',

        // Client Space
        client_welcome_title: 'Bienvenue dans votre Espace Client Privilège Routini',
        client_welcome_desc: 'Profitez de 10% de remise sur vos commandes, cumulez 1 point fidélité par 10 DH d\'achat, et parrainez vos amis pendant 12 mois.',
        client_stat_points: 'Points Fidélité',
        client_stat_orders: 'Commandes Beauté',
        client_stat_delivery: 'Dernière Livraison',
        client_stat_ratio: 'Barème Fidélité',
        client_ratio_val: '1 Pt = 10 DH d\'achat (20 Pts = 10 DH déductibles)',
        client_btn_order: 'Commander des Soins & Packs',
        client_btn_referral: 'Mon Programme de Parrainage (12 Mois)',
        client_orders_title: 'Historique de vos Commandes & Suivis de Colis',

        // Parrainage Client
        referral_card_title: 'Programme de Parrainage Client Privilège (12 Mois)',
        referral_card_desc: 'Partagez votre lien exclusif avec vos proches. Chaque ami inscrit vous rapporte +50 points fidélité et des réductions sur ses achats pendant 12 mois !',
        referral_my_link: 'Mon Lien de Parrainage Client :',
        referral_my_code: 'Mon Code Parrain :',
        referral_copy_btn: 'Copier le Lien',
        referral_copied: 'Lien copié dans le presse-papiers !',
        referral_validity: 'Validité du Programme :',
        referral_status_active: 'Actif (12 mois à compter de l\'adhésion)',
        referral_friends_title: 'Amis Parrainés Réalisés',

        // Inscription
        reg_distrib_title: 'Formulaire d\'Adhésion Partenaire ROUTINE ONE PLAN',
        reg_fullname: 'Nom et Prénom :',
        reg_cin: 'N° CIN / Passeport (Obligatoire) :',
        reg_email: 'Adresse Email :',
        reg_phone: 'Numéro de Téléphone :',
        reg_city: 'Ville de Résidence :',
        reg_country: 'Pays :',
        reg_sponsor_code: 'Code Parrain :',
        reg_sponsor_name: 'Nom du Parrain :',
        reg_client_title: 'Inscription Client Privilège Routini',
        reg_client_cin: 'N° CIN / Pièce d\'Identité (Obligatoire) :',
        reg_client_ref_optional: 'Code Parrain Ami (Optionnel) :',
        reg_submit_client: 'Créer mon Compte & Accéder à la Boutique',

        // Tree
        tree_title: 'Arbre Généalogique Réseau',
        tree_zoom_fit: 'Ajuster à l\'écran (Vue Globale)',
        tree_zoom_in: 'Zoom +',
        tree_zoom_out: 'Zoom -',
        tree_zoom_reset: 'Réinitialiser (100%)',
        tree_expand_all: 'Tout Déplier',
        tree_collapse_all: 'Tout Réduire',
        tree_search_placeholder: 'Rechercher un partenaire ou code...',

        // Shop & Cart
        shop_title: 'Boutique Cosmétiques & Rituels',
        shop_add_cart: 'Ajouter au Panier',
        shop_add_pack: 'Ajouter ce Pack',
        shop_promo_badge: 'PROMOTION',
        shop_save_badge: 'Économie :',
        cart_title: 'Votre Panier Routini',
        cart_empty: 'Votre panier est vide.',
        cart_subtotal: 'Sous-total articles :',
        cart_client_discount: 'Remise Client Privilège (-10%) :',
        cart_shipping: 'Frais de Livraison Amana Express (Fixe) :',
        cart_shipping_note: 'Pas de livraison offerte - Expédition sécurisée sous 24/48h',
        cart_total: 'Total Net TTC à Régler :',
        cart_points_earned: 'Points Fidélité Gagnés :',
        cart_checkout_btn: 'Valider et Confirmer la Commande',

        // Facture
        invoice_title: 'Facture Officielle Routini eWorld',
        invoice_btn_view: 'Facture',
        invoice_btn_print: 'Imprimer / Télécharger PDF',
        invoice_number: 'Facture N° :',
        invoice_date: 'Date d\'émission :',
        invoice_customer_id: 'Identifiant Client :',
        invoice_customer_name: 'Nom du Client :',
        invoice_customer_cin: 'CIN / Pièce d\'identité :',
        invoice_phone: 'Téléphone :',
        invoice_address: 'Adresse de Livraison :',
        invoice_articles: 'Articles & Soins',
        invoice_qty: 'Quantité',
        invoice_unit_price: 'Prix Unitaire',
        invoice_total_line: 'Total Ligne',
        invoice_points_total: 'Total Points de la Commande :',
        invoice_paid: 'PAYÉ',

        // Admin
        admin_btn_create_product: 'Créer Nouveau Produit',
        admin_btn_create_pack: 'Créer un Pack de Produits',
        admin_tab_all: 'Tous',
        admin_tab_packs: 'Packs & Rituels',
        admin_tab_solo: 'Produits',
        admin_action_edit: 'Modifier',
        admin_action_duplicate: 'Dupliquer',
        admin_action_delete: 'Effacer',
        admin_pack_select_products: 'Sélectionner les Produits à inclure dans le Pack :',
        admin_pack_sum_calculated: 'Prix Total Cumulé des Produits :',
        admin_pack_special_price: 'Prix Spécial du Pack (PP en DH) :',
        admin_pack_promo_checkbox: 'Mettre ce Pack en Promotion',
        admin_pack_promo_badge: 'Badge Promotionnel (ex: PROMO -20%) :'
      },

      en: {
        langName: 'English',
        flag: '🇬🇧',
        dir: 'ltr',
        nav_dashboard: 'Dashboard',
        nav_genealogy: 'Genealogy Tree',
        nav_shop: 'Cosmetics Store',
        nav_bonus: 'Commissions & E-Point',
        nav_sponsor: 'New Distributor',
        nav_admin: 'General Management',
        nav_client_orders: 'My Orders & Deliveries',
        nav_client_loyalty: 'My Loyalty Points',
        nav_client_referral: 'Referral & Friends',
        nav_logout: 'Sign Out',
        nav_change_profile: 'Switch Profile',
        nav_main_title: 'Main Navigation',
        nav_client_title: 'Customer Area',

        header_title: 'eWorld Dashboard',
        header_desc: 'Overview of your Routini performance and qualifications',
        header_change_account: 'Switch Account',
        wallet_balance: 'Wallet Balance',
        fidelity_points: 'Loyalty Pts',

        auth_title: 'Secure Portal for Distributors & General Management',
        auth_tab_client: 'Customer Space',
        auth_tab_distributor: 'Distributor Space',
        auth_tab_owner: 'General Management',
        auth_id_numeric_label: '100% Numeric Identifier (digits only):',
        auth_id_client_label: 'Customer ID (digits):',
        auth_id_admin_label: 'Administrator Identifier:',
        auth_id_placeholder: 'Ex: 818204921 (digits only)',
        auth_password_label: 'Password:',
        auth_remember: 'Remember my credentials',
        auth_submit_distrib: 'Login Distributor Space',
        auth_submit_client: 'Login Privilege Customer Space',
        auth_submit_admin: 'Login Management (Admin)',
        auth_new_client_title: 'New Routini Privilege Customer?',
        auth_new_client_desc: 'Order directly with 10% discount and earn loyalty points!',
        auth_create_client_btn: 'Create Customer Account (Free)',

        metric_ppv: 'Personal Points (PPV)',
        metric_gpv: 'Team Volume (PV)',
        metric_sv: 'Commission Base (CV)',
        metric_wallet: 'E-Point Wallet',
        metric_active_distrib: 'Qualified Active Distributor',
        metric_inactive_distrib: 'Inactive Distributor (< PV threshold)',

        client_welcome_title: 'Welcome to your Routini Privilege Customer Space',
        client_welcome_desc: 'Enjoy a 10% discount on orders, earn 1 loyalty point per 10 MAD spent, and refer friends for 12 months.',
        client_stat_points: 'Loyalty Points',
        client_stat_orders: 'Beauty Orders',
        client_stat_delivery: 'Latest Delivery',
        client_stat_ratio: 'Loyalty Scale',
        client_ratio_val: '1 Pt = 10 MAD spent (20 Pts = 10 MAD discount)',
        client_btn_order: 'Order Skincare & Packs',
        client_btn_referral: 'My Referral Program (12 Months)',
        client_orders_title: 'Order History & Package Tracking',

        referral_card_title: 'Privilege Customer Referral Program (12 Months)',
        referral_card_desc: 'Share your exclusive link with loved ones. Each registered friend earns you +50 loyalty points and discounts on their purchases for 12 months!',
        referral_my_link: 'My Customer Referral Link:',
        referral_my_code: 'My Referral Code:',
        referral_copy_btn: 'Copy Link',
        referral_copied: 'Link copied to clipboard!',
        referral_validity: 'Program Validity:',
        referral_status_active: 'Active (12 months from registration)',
        referral_friends_title: 'Referred Friends List',

        reg_distrib_title: 'ROUTINE ONE PLAN Partner Registration Form',
        reg_fullname: 'Full Name:',
        reg_cin: 'CIN / Passport ID (Mandatory):',
        reg_email: 'Email Address:',
        reg_phone: 'Phone Number:',
        reg_city: 'City of Residence:',
        reg_country: 'Country:',
        reg_sponsor_code: 'Sponsor Code:',
        reg_sponsor_name: 'Sponsor Name:',
        reg_client_title: 'Routini Privilege Customer Registration',
        reg_client_cin: 'CIN / National ID (Mandatory):',
        reg_client_ref_optional: 'Friend Referral Code (Optional):',
        reg_submit_client: 'Create Account & Access Store',

        tree_title: 'Network Genealogy Tree',
        tree_zoom_fit: 'Fit to Screen (Overview)',
        tree_zoom_in: 'Zoom In (+)',
        tree_zoom_out: 'Zoom Out (-)',
        tree_zoom_reset: 'Reset (100%)',
        tree_expand_all: 'Expand All',
        tree_collapse_all: 'Collapse All',
        tree_search_placeholder: 'Search partner or code...',

        shop_title: 'Cosmetics & Rituals Store',
        shop_add_cart: 'Add to Cart',
        shop_add_pack: 'Add this Pack',
        shop_promo_badge: 'PROMOTION',
        shop_save_badge: 'You Save:',
        cart_title: 'Your Routini Cart',
        cart_empty: 'Your cart is empty.',
        cart_subtotal: 'Items Subtotal:',
        cart_client_discount: 'Customer Privilege Discount (-10%):',
        cart_shipping: 'Amana Express Shipping Fee (Flat):',
        cart_shipping_note: 'No free delivery - Express tracked delivery within 24/48h',
        cart_total: 'Total Net to Pay:',
        cart_points_earned: 'Loyalty Points Earned:',
        cart_checkout_btn: 'Confirm & Place Order',

        invoice_title: 'Routini eWorld Official Invoice',
        invoice_btn_view: 'Invoice',
        invoice_btn_print: 'Print / Download PDF',
        invoice_number: 'Invoice No.:',
        invoice_date: 'Date of Issue:',
        invoice_customer_id: 'Customer ID:',
        invoice_customer_name: 'Customer Name:',
        invoice_customer_cin: 'CIN / ID Card:',
        invoice_phone: 'Phone:',
        invoice_address: 'Shipping Address:',
        invoice_articles: 'Items & Skincare',
        invoice_qty: 'Qty',
        invoice_unit_price: 'Unit Price',
        invoice_total_line: 'Line Total',
        invoice_points_total: 'Total Order Points:',
        invoice_paid: 'PAID',

        admin_btn_create_product: 'Create New Product',
        admin_btn_create_pack: 'Create Product Pack',
        admin_tab_all: 'All',
        admin_tab_packs: 'Packs & Rituals',
        admin_tab_solo: 'Products',
        admin_action_edit: 'Edit',
        admin_action_duplicate: 'Duplicate',
        admin_action_delete: 'Delete',
        admin_pack_select_products: 'Select Products to Include in Pack:',
        admin_pack_sum_calculated: 'Calculated Products Total Price:',
        admin_pack_special_price: 'Special Pack Price (PP in MAD):',
        admin_pack_promo_checkbox: 'Set this Pack on Promotion',
        admin_pack_promo_badge: 'Promo Badge (e.g. PROMO -20%):'
      },

      ar: {
        langName: 'العربية',
        flag: '🇲🇦',
        dir: 'rtl',
        nav_dashboard: 'لوحة القيادة',
        nav_genealogy: 'شجرة الشبكة',
        nav_shop: 'متجر مستحضرات التجميل',
        nav_bonus: 'العمولات والمحفظة',
        nav_sponsor: 'تسجيل موزع جديد',
        nav_admin: 'الإدارة العامة',
        nav_client_orders: 'طلباتي وتتبع الشحن',
        nav_client_loyalty: 'نقاط الوفاء الخاصة بي',
        nav_client_referral: 'برنامج الإحالة والأصدقاء',
        nav_logout: 'تسجيل الخروج',
        nav_change_profile: 'تغيير الحساب',
        nav_main_title: 'التنقل الرئيسي',
        nav_client_title: 'فضاء الزبون',

        header_title: 'لوحة قيادة روتيني إي-وورلد',
        header_desc: 'نظرة عامة على أدائك ورتبك ومبيعاتك في روتيني',
        header_change_account: 'تبديل الحساب',
        wallet_balance: 'رصيد المحفظة',
        fidelity_points: 'نقاط الوفاء',

        auth_title: 'البوابة الآمنة للموزعين المستقلين والإدارة العامة',
        auth_tab_client: 'فضاء الزبون',
        auth_tab_distributor: 'فضاء الموزع',
        auth_tab_owner: 'الإدارة العامة',
        auth_id_numeric_label: 'المعرف الرقمي 100% (أرقام فقط بدون حروف) :',
        auth_id_client_label: 'رقم الزبون (أرقام فقط) :',
        auth_id_admin_label: 'معرف المدير العام :',
        auth_id_placeholder: 'مثال: 818204921 (أرقام فقط)',
        auth_password_label: 'كلمة المرور :',
        auth_remember: 'تذكر بيانات الدخول',
        auth_submit_distrib: 'دخول فضاء الموزع المستقل',
        auth_submit_client: 'دخول فضاء الزبون المميز',
        auth_submit_admin: 'دخول الإدارة العامة (المدير)',
        auth_new_client_title: 'زبون مميز جديد في روتيني ؟',
        auth_new_client_desc: 'اطلب مباشرة بخصم 10% واجمع نقاط الوفاء مع كل طلبية !',
        auth_create_client_btn: 'إنشاء حساب زبون (مجاني)',

        metric_ppv: 'النقاط الشخصية (PPV)',
        metric_gpv: 'حجم الفريق (PV)',
        metric_sv: 'قاعدة العمولات (CV)',
        metric_wallet: 'محفظة النقاط الإلكترونية',
        metric_active_distrib: 'موزع نشط مؤهل',
        metric_inactive_distrib: 'موزع غير نشط (أقل من الحد الأدنى)',

        client_welcome_title: 'مرحبًا بك في فضاء الزبون المميز لدى روتيني',
        client_welcome_desc: 'استفد من خصم 10% على كافة المشتريات، واكسب نقطة وفاء مقابل كل 10 دراهم، واستفد من أرباح الإحالة لمدة 12 شهرًا.',
        client_stat_points: 'نقاط الوفاء',
        client_stat_orders: 'طلبات العناية',
        client_stat_delivery: 'آخر إرسالية',
        client_stat_ratio: 'سلم الوفاء',
        client_ratio_val: '1 نقطة = 10 دراهم شراء (20 نقطة = خصم 10 دراهم)',
        client_btn_order: 'طلب مستحضرات العناية والباقات',
        client_btn_referral: 'برنامج الإحالة الخاص بي (12 شهرًا)',
        client_orders_title: 'سجل الطلبات وتتبع الشحنات أمانة',

        referral_card_title: 'برنامج إحالة الزبائن المميزين (صلاحية 12 شهرًا)',
        referral_card_desc: 'شارك رابطك الحصري مع معارفك وأصدقائك. كل صديق يسجل يمنحك +50 نقطة وفاء وأرباحًا عن مشترياته طيلة 12 شهرًا !',
        referral_my_link: 'رابط الإحالة الخاص بي :',
        referral_my_code: 'رمز الإحالة الخاص بي :',
        referral_copy_btn: 'نسخ الرابط',
        referral_copied: 'تم نسخ الرابط بنجاح !',
        referral_validity: 'مدة صلاحية البرنامج :',
        referral_status_active: 'نشط (12 شهرًا ابتداءً من تاريخ التسجيل)',
        referral_friends_title: 'قائمة الأصدقاء المحالين',

        reg_distrib_title: 'استمارة انضمام شريك موزع - روتيني ون بلان',
        reg_fullname: 'الاسم الكامل :',
        reg_cin: 'رقم بطاقة التعريف الوطنية / الجواز (إجباري) :',
        reg_email: 'البريد الإلكتروني :',
        reg_phone: 'رقم الهاتف :',
        reg_city: 'مدينة الإقامة :',
        reg_country: 'الدولة :',
        reg_sponsor_code: 'رمز الراعي (المستضيف) :',
        reg_sponsor_name: 'اسم الراعي :',
        reg_client_title: 'تسجيل حساب زبون مميز روتيني',
        reg_client_cin: 'رقم بطاقة التعريف الوطنية (إجباري لجميع التسجيلات) :',
        reg_client_ref_optional: 'رمز الراعي المحيل (اختياري) :',
        reg_submit_client: 'إنشاء حسابي والدخول إلى المتجر',

        tree_title: 'شجرة الشبكة والنسب للموزعين',
        tree_zoom_fit: 'ملاءمة مع الشاشة (عرض كامل للشبكة)',
        tree_zoom_in: 'تكبير (+)',
        tree_zoom_out: 'تصغير (-)',
        tree_zoom_reset: 'إعادة الضبط (100%)',
        tree_expand_all: 'توسيع الكل',
        tree_collapse_all: 'طي الكل',
        tree_search_placeholder: 'ابحث عن موزع أو رمز...',

        shop_title: 'متجر مستحضرات العناية والباقات',
        shop_add_cart: 'أضف إلى السلة',
        shop_add_pack: 'أضف هذه الباقة',
        shop_promo_badge: 'تخفيض خاص',
        shop_save_badge: 'وفرت :',
        cart_title: 'سلة مشتريات روتيني',
        cart_empty: 'سلتك فارغة حاليًا.',
        cart_subtotal: 'المجموع الجزئي للمنتجات :',
        cart_client_discount: 'خصم الزبون المميز (-10%) :',
        cart_shipping: 'مصاريف التوصيل أمانة إكسبريس (ثابتة) :',
        cart_shipping_note: 'لا يوجد شحن مجاني للجميع - توصيل آمن خلال 24/48 ساعة',
        cart_total: 'المبلغ الإجمالي الصافي للأداء :',
        cart_points_earned: 'نقاط الوفاء المكتسبة :',
        cart_checkout_btn: 'تأكيد وإتمام الطلبية',

        invoice_title: 'فاتورة رسمية روتيني إي-وورلد',
        invoice_btn_view: 'الفاتورة',
        invoice_btn_print: 'طباعة الفاتورة / تحميل PDF',
        invoice_number: 'رقم الفاتورة :',
        invoice_date: 'تاريخ الإصدار :',
        invoice_customer_id: 'معرف الزبون :',
        invoice_customer_name: 'اسم الزبون :',
        invoice_customer_cin: 'رقم بطاقة التعريف الوطنية :',
        invoice_phone: 'الهاتف :',
        invoice_address: 'عنوان التوصيل :',
        invoice_articles: 'المنتجات ومستحضرات العناية',
        invoice_qty: 'الكمية',
        invoice_unit_price: 'سعر الوحدة',
        invoice_total_line: 'المجموع',
        invoice_points_total: 'مجموع نقاط الطلبية :',
        invoice_paid: 'تم الأداء',

        admin_btn_create_product: 'إنشاء منتج جديد',
        admin_btn_create_pack: 'إنشاء باقة منتجات',
        admin_tab_all: 'الكل',
        admin_tab_packs: 'الباقات والطقوس',
        admin_tab_solo: 'المنتجات',
        admin_action_edit: 'تعديل',
        admin_action_duplicate: 'تكرار / نسخ',
        admin_action_delete: 'حذف',
        admin_pack_select_products: 'اختر المنتجات المراد إدراجها في الباقة :',
        admin_pack_sum_calculated: 'المجموع التراكمي لأسعار المنتجات :',
        admin_pack_special_price: 'السعر الخاص بالباقة (سعر العموم بالدرهم) :',
        admin_pack_promo_checkbox: 'تفعيل التخفيض والعرض الترويجي لهذه الباقة',
        admin_pack_promo_badge: 'شارة العرض (مثال: عرض خاص -20%) :'
      },

      es: {
        langName: 'Español',
        flag: '🇪🇸',
        dir: 'ltr',
        nav_dashboard: 'Panel de Control',
        nav_genealogy: 'Árbol Genealógico',
        nav_shop: 'Tienda de Cosméticos',
        nav_bonus: 'Comisiones y E-Point',
        nav_sponsor: 'Nuevo Distribuidor',
        nav_admin: 'Dirección General',
        nav_client_orders: 'Mis Pedidos y Entregas',
        nav_client_loyalty: 'Mis Puntos de Fidelidad',
        nav_client_referral: 'Patrocinio y Amigos',
        nav_logout: 'Cerrar Sesión',
        nav_change_profile: 'Cambiar Perfil',
        nav_main_title: 'Navegación Principal',
        nav_client_title: 'Espacio Cliente',

        header_title: 'Panel de Control eWorld',
        header_desc: 'Visión general de su rendimiento y calificaciones en Routini',
        header_change_account: 'Cambiar de Cuenta',
        wallet_balance: 'Saldo de Cartera',
        fidelity_points: 'Pts Fidelidad',

        auth_title: 'Portal Seguro Integrado para Distribuidores y Dirección General',
        auth_tab_client: 'Espacio Cliente',
        auth_tab_distributor: 'Espacio Distribuidor',
        auth_tab_owner: 'Dirección General',
        auth_id_numeric_label: 'Identificador 100% Numérico (sólo dígitos):',
        auth_id_client_label: 'Código de Cliente (dígitos):',
        auth_id_admin_label: 'Identificador de Administrador:',
        auth_id_placeholder: 'Ej: 818204921 (sólo dígitos)',
        auth_password_label: 'Contraseña:',
        auth_remember: 'Recordar mis credenciales',
        auth_submit_distrib: 'Conexión Espacio Distribuidor',
        auth_submit_client: 'Conexión Espacio Cliente Privilegiado',
        auth_submit_admin: 'Conexión Dirección General (Admin)',
        auth_new_client_title: '¿Nuevo Cliente Privilegiado en Routini?',
        auth_new_client_desc: '¡Ordene directamente con un 10% de descuento y acumule puntos de fidelidad!',
        auth_create_client_btn: 'Crear mi Cuenta de Cliente (Gratis)',

        metric_ppv: 'Puntos Personales (PPV)',
        metric_gpv: 'Volumen de Equipo (PV)',
        metric_sv: 'Base de Comisiones (CV)',
        metric_wallet: 'Cartera E-Point',
        metric_active_distrib: 'Distribuidor Activo Calificado',
        metric_inactive_distrib: 'Distribuidor Inactivo (< umbral PV)',

        client_welcome_title: 'Bienvenido a su Espacio de Cliente Privilegiado Routini',
        client_welcome_desc: 'Disfrute de un 10% de descuento en pedidos, gane 1 punto de fidelidad por cada 10 MAD y patrocine amigos durante 12 meses.',
        client_stat_points: 'Puntos de Fidelidad',
        client_stat_orders: 'Pedidos de Belleza',
        client_stat_delivery: 'Última Entrega',
        client_stat_ratio: 'Escala de Fidelidad',
        client_ratio_val: '1 Pt = 10 MAD de compra (20 Pts = 10 MAD de descuento)',
        client_btn_order: 'Pedir Cosméticos y Packs',
        client_btn_referral: 'Mi Programa de Patrocinio (12 Meses)',
        client_orders_title: 'Historial de Pedidos y Seguimiento de Paquetes',

        referral_card_title: 'Programa de Patrocinio Cliente Privilegiado (12 Meses)',
        referral_card_desc: '¡Comparta su enlace exclusivo. Cada amigo registrado le otorga +50 puntos de fidelidad y descuentos sobre sus compras durante 12 meses!',
        referral_my_link: 'Mi Enlace de Patrocinio:',
        referral_my_code: 'Mi Código de Patrocinador:',
        referral_copy_btn: 'Copiar Enlace',
        referral_copied: '¡Enlace copiado al portapapeles!',
        referral_validity: 'Validez del Programa:',
        referral_status_active: 'Activo (12 meses a partir de la inscripción)',
        referral_friends_title: 'Lista de Amigos Patrocinados',

        reg_distrib_title: 'Formulario de Adhesión ROUTINE ONE PLAN',
        reg_fullname: 'Nombre y Apellidos:',
        reg_cin: 'N° CIN / Pasaporte (Obligatorio):',
        reg_email: 'Correo Electrónico:',
        reg_phone: 'Número de Teléfono:',
        reg_city: 'Ciudad de Residencia:',
        reg_country: 'País:',
        reg_sponsor_code: 'Código de Patrocinador:',
        reg_sponsor_name: 'Nombre de Patrocinador:',
        reg_client_title: 'Inscripción Cliente Privilegiado Routini',
        reg_client_cin: 'N° CIN / Documento de Identidad (Obligatorio):',
        reg_client_ref_optional: 'Código de Patrocinador Amigo (Opcional):',
        reg_submit_client: 'Crear Cuenta y Acceder a la Tienda',

        tree_title: 'Árbol Genealógico de la Red',
        tree_zoom_fit: 'Ajustar a la Pantalla (Vista Global)',
        tree_zoom_in: 'Acercar (+)',
        tree_zoom_out: 'Alejar (-)',
        tree_zoom_reset: 'Restablecer (100%)',
        tree_expand_all: 'Desplegar Todo',
        tree_collapse_all: 'Plegar Todo',
        tree_search_placeholder: 'Buscar distribuidor o código...',

        shop_title: 'Tienda de Cosméticos y Rituales',
        shop_add_cart: 'Añadir al Carrito',
        shop_add_pack: 'Añadir este Pack',
        shop_promo_badge: 'PROMOCIÓN',
        shop_save_badge: 'Ahorro:',
        cart_title: 'Su Carrito Routini',
        cart_empty: 'Su carrito está vacío.',
        cart_subtotal: 'Subtotal artículos:',
        cart_client_discount: 'Descuento Cliente Privilegiado (-10%):',
        cart_shipping: 'Gastos de Envío Amana Express (Fijo):',
        cart_shipping_note: 'Sin envío gratuito para todos - Envío asegurado en 24/48h',
        cart_total: 'Total Neto a Pagar:',
        cart_points_earned: 'Puntos de Fidelidad Ganados:',
        cart_checkout_btn: 'Validar y Confirmar el Pedido',

        invoice_title: 'Factura Oficial Routini eWorld',
        invoice_btn_view: 'Factura',
        invoice_btn_print: 'Imprimir / Descargar PDF',
        invoice_number: 'Factura N°:',
        invoice_date: 'Fecha de Emisión:',
        invoice_customer_id: 'ID Cliente:',
        invoice_customer_name: 'Nombre del Cliente:',
        invoice_customer_cin: 'CIN / Documento:',
        invoice_phone: 'Teléfono:',
        invoice_address: 'Dirección de Entrega:',
        invoice_articles: 'Artículos y Cosméticos',
        invoice_qty: 'Cantidad',
        invoice_unit_price: 'Precio Unitario',
        invoice_total_line: 'Total Línea',
        invoice_points_total: 'Total Puntos del Pedido:',
        invoice_paid: 'PAGADO',

        admin_btn_create_product: 'Crear Nuevo Producto',
        admin_btn_create_pack: 'Crear Pack de Productos',
        admin_tab_all: 'Todos',
        admin_tab_packs: 'Packs y Rituales',
        admin_tab_solo: 'Productos',
        admin_action_edit: 'Modificar',
        admin_action_duplicate: 'Duplicar',
        admin_action_delete: 'Eliminar',
        admin_pack_select_products: 'Seleccionar Productos a Incluir en el Pack:',
        admin_pack_sum_calculated: 'Precio Total Calculado de los Productos:',
        admin_pack_special_price: 'Precio Especial del Pack (PP en MAD):',
        admin_pack_promo_checkbox: 'Poner este Pack en Promoción',
        admin_pack_promo_badge: 'Distintivo de Promoción (ej: PROMO -20%):'
      }
    };

    // Dictionnaire direct de phrases pour traduction automatique et intégrale de toute l'application
    this.phraseMap = {
      // Navigation
      "Navigation Principale": { en: "Main Navigation", ar: "التنقل الرئيسي", es: "Navegación Principal" },
      "Tableau de Bord": { en: "Dashboard", ar: "لوحة التحكم", es: "Panel de Control" },
      "Arbre Généalogique": { en: "Genealogy Tree", ar: "شجرة الشبكة", es: "Árbol Genealógico" },
      "Boutique Cosmétiques": { en: "Cosmetics Store", ar: "متجر مستحضرات التجميل", es: "Tienda de Cosméticos" },
      "Commissions & E-Point": { en: "Commissions & E-Point", ar: "العمولات والمحفظة", es: "Comisiones y E-Point" },
      "Nouveau Distributeur": { en: "New Distributor", ar: "موزع جديد", es: "Nuevo Distribuidor" },
      "Direction Routini": { en: "Routini Governance", ar: "إدارة روتيني", es: "Dirección Routini" },
      "Direction Générale": { en: "General Management", ar: "الإدارة العامة", es: "Dirección General" },
      "Déconnexion": { en: "Sign Out", ar: "تسجيل الخروج", es: "Cerrar Sesión" },
      "Changer de Profil (Menu)": { en: "Switch Profile (Menu)", ar: "تبديل الحساب (القائمة)", es: "Cambiar de Perfil (Menú)" },
      "Changer de Compte": { en: "Switch Account", ar: "تبديل الحساب", es: "Cambiar de Cuenta" },
      "Mes Commandes & Livraisons": { en: "My Orders & Deliveries", ar: "طلباتي والتوصيل", es: "Mis Pedidos y Entregas" },
      "Mes Points Fidélité": { en: "My Loyalty Points", ar: "نقاط الولاء", es: "Mis Puntos de Fidelidad" },
      "Réseau": { en: "Network", ar: "الشبكة", es: "Red" },
      "Owner": { en: "Owner", ar: "المالك", es: "Owner" },
      "Accueil": { en: "Home", ar: "الرئيسية", es: "Inicio" },
      "Boutique": { en: "Store", ar: "المتجر", es: "Tienda" },
      "Gains": { en: "Earnings", ar: "الأرباح", es: "Ganancias" },
      "Menu": { en: "Menu", ar: "القائمة", es: "Menú" },

      // En-tête & Barre rapide
      "Tableau de Bord eWorld": { en: "eWorld Dashboard", ar: "لوحة تحكم إي-وورلد", es: "Panel de Control eWorld" },
      "Aperçu général de vos performances et qualifications Routini": { en: "Overview of your Routini performance and qualifications", ar: "نظرة عامة على أدائك ومؤهلاتك روتيني", es: "Resumen de su rendimiento y calificaciones" },
      "Direction (ADMIN)": { en: "Management (ADMIN)", ar: "الإدارة (مشرف)", es: "Dirección (ADMIN)" },
      "Changer de profil (Tous les membres)": { en: "Switch profile (All members)", ar: "تغيير الحساب (جميع الأعضاء)", es: "Cambiar de perfil (Todos los miembros)" },
      "Changer de profil (51 membres)": { en: "Switch profile (51 members)", ar: "تغيير الحساب (51 عضواً)", es: "Cambiar de perfil (51 miembros)" },
      "Menu d'Accueil": { en: "Home Menu", ar: "القائمة الرئيسية", es: "Menú Principal" },
      "Session :": { en: "Session:", ar: "الجلسة:", es: "Sesión:" },
      "Session active :": { en: "Active session:", ar: "الجلسة النشطة:", es: "Sesión activa:" },
      "DIRECTION FONDATRICE": { en: "FOUNDING MANAGEMENT", ar: "الإدارة التأسيسية", es: "DIRECCIÓN FUNDADORA" },
      "CLIENT PRIVILÈGE (SANS ARBRE)": { en: "PRIVILEGE CUSTOMER (NO TREE)", ar: "عميل مميز (بدون شجرة)", es: "CLIENTE PRIVILEGIADO (SIN ÁRBOL)" },
      "PROPRIÉTAIRE": { en: "OWNER", ar: "المالك", es: "PROPIETARIO" },
      "Tous": { en: "All", ar: "الكل", es: "Todos" },
      "Ambassadeur": { en: "Ambassador", ar: "سفير", es: "Embajador" },
      "Diamond": { en: "Diamond", ar: "ماسي", es: "Diamante" },
      "Manager": { en: "Manager", ar: "مدير", es: "Gerente" },
      "Leader": { en: "Leader", ar: "قائد", es: "Líder" },
      "Builder": { en: "Builder", ar: "بانٍ", es: "Constructor" },
      "Partner": { en: "Partner", ar: "شريك", es: "Socio" },
      "Client Direct": { en: "Direct Customer", ar: "عميل مباشر", es: "Cliente Directo" },

      // Qualifications & Métriques
      "Statut de Qualification Mensuelle": { en: "Monthly Qualification Status", ar: "حالة التأهيل الشهري", es: "Estado de Calificación Mensual" },
      "Objectif vers le prochain palier d'honneur :": { en: "Goal for next honor rank:", ar: "الهدف نحو الرتبة الفخرية التالية:", es: "Objetivo hacia el siguiente rango de honor:" },
      "Progression PGPV": { en: "PGPV Progress", ar: "تقدم نقاط الفريق", es: "Progreso PGPV" },
      "Points Personnels (PPV)": { en: "Personal Points (PPV)", ar: "النقاط الشخصية (PPV)", es: "Puntos Personales (PPV)" },
      "Volume Équipe (PV)": { en: "Team Volume (PV)", ar: "حجم الفريق (PV)", es: "Volumen de Equipo (PV)" },
      "Base Commissions (SV / CV)": { en: "Commission Base (SV / CV)", ar: "أساس العمولات (SV / CV)", es: "Base de Comisiones (SV / CV)" },
      "Portefeuille E-Point": { en: "E-Point Wallet", ar: "محفظة النقاط الإلكترونية", es: "Billetera E-Point" },
      "Distributeur Actif Qualifié": { en: "Qualified Active Distributor", ar: "موزع نشط ومؤهل", es: "Distribuidor Activo Calificado" },
      "Distributeur Inactif (< 50 PV)": { en: "Inactive Distributor (< 50 PV)", ar: "موزع غير نشط (< 50 PV)", es: "Distribuidor Inactivo (< 50 PV)" },
      "Descendance active": { en: "Active downlines", ar: "الأعضاء النشطون", es: "Descendencia activa" },
      "Base officielle N1/N2/N3 & Leadership": { en: "Official N1/N2/N3 & Leadership base", ar: "الأساس الرسمي N1/N2/N3 والقيادة", es: "Base oficial N1/N2/N3 y Liderazgo" },
      "Disponible immédiatement": { en: "Available immediately", ar: "متاح فورياً", es: "Disponible de inmediato" },
      "Dernières Commandes Cosmétiques Validées": { en: "Latest Validated Cosmetics Orders", ar: "آخر طلبات مستحضرات التجميل المؤكدة", es: "Últimos Pedidos Validados" },
      "Commander des Cosmétiques": { en: "Order Cosmetics", ar: "طلب مستحضرات التجميل", es: "Pedir Cosméticos" },
      "Réf. Commande": { en: "Order Ref", ar: "مرجع الطلب", es: "Ref. Pedido" },
      "Date": { en: "Date", ar: "التاريخ", es: "Fecha" },
      "Distributeur": { en: "Distributor", ar: "الموزع", es: "Distribuidor" },
      "Points (PV)": { en: "Points (PV)", ar: "النقاط (PV)", es: "Puntos (PV)" },
      "Montant Payé": { en: "Amount Paid", ar: "المبلغ المدفوع", es: "Importe Pagado" },
      "Statut": { en: "Status", ar: "الحالة", es: "Estado" },
      "Facture": { en: "Invoice", ar: "فاتورة", es: "Factura" },

      // Espace Client
      "Bienvenue dans votre Espace Client Privilège Routini": { en: "Welcome to your Routini Privilege Customer Space", ar: "مرحباً بكم في مساحة العميل المميز روتيني", es: "Bienvenido a su Espacio Cliente Privilegiado Routini" },
      "Profitez de l'excellence de nos rituels cosmétiques sans contrainte de réseau MLM, suivez vos livraisons Amana en direct et cumulez vos points fidélité.": {
        en: "Enjoy the excellence of our cosmetic rituals without MLM network constraints, track your Amana shipments live, and earn loyalty points.",
        ar: "استمتعوا بتميز طقوسنا التجميلية دون قيود الشبكة، وتابعوا شحناتكم مباشرة واكسبوا نقاط الولاء.",
        es: "Disfrute de la excelencia de nuestros rituales cosméticos sin restricciones de red MLM, siga sus envíos de Amana en vivo y acumule puntos de fidelidad."
      },
      "Solde Fidélité": { en: "Loyalty Balance", ar: "رصيد الولاء", es: "Saldo de Fidelidad" },
      "de réduction": { en: "discount", ar: "خصم", es: "de descuento" },
      "Points Fidélité": { en: "Loyalty Points", ar: "نقاط الولاء", es: "Puntos de Fidelidad" },
      "Commandes Beauté": { en: "Beauty Orders", ar: "طلبات الجمال", es: "Pedidos de Belleza" },
      "Dernière Livraison": { en: "Latest Delivery", ar: "آخر شحنة", es: "Última Entrega" },
      "Barème Réduction": { en: "Discount Scale", ar: "جدول الخصم", es: "Escala de Descuento" },
      "10% du montant reversé en points fidélité": { en: "10% of amount returned in loyalty points", ar: "10% من المبلغ يُسترد كنقاط ولاء", es: "10% del importe devuelto en puntos de fidelidad" },
      "Soins et rituels commandés": { en: "Skincare and rituals ordered", ar: "المستحضرات والطقوس المطلوبة", es: "Tratamientos y rituales pedidos" },
      "En cours d'expédition": { en: "Shipping in progress", ar: "قيد الشحن", es: "En curso de envío" },
      "Livrée": { en: "Delivered", ar: "تم التسليم", es: "Entregada" },
      "20 Pts = 10 DH": { en: "20 Pts = 10 MAD", ar: "20 نقطة = 10 دراهم", es: "20 Pts = 10 DH" },
      "Déductible directement sur vos commandes": { en: "Directly deductible on your orders", ar: "تُخصم مباشرة من طلباتكم", es: "Deducible directamente en sus pedidos" },
      "Commander des Soins & Packs": { en: "Order Skincare & Packs", ar: "طلب المستحضرات والمجموعات", es: "Pedir Cuidados y Packs" },
      "Détails Points & Avantages": { en: "Points & Benefits Details", ar: "تفاصيل النقاط والمزايا", es: "Detalles de Puntos y Ventajas" },
      "Mes Commandes Récents & Suivis Amana Express": { en: "My Recent Orders & Amana Express Tracking", ar: "طلباتي الأخيرة وتتبع أمانة إكسبريس", es: "Mis Pedidos Recientes y Seguimiento Amana Express" },

      // Connexion & Auth
      "Portail Officiel • eWorld MLM": { en: "Official Portal • eWorld MLM", ar: "البوابة الرسمية • إي-وورلد", es: "Portal Oficial • eWorld MLM" },
      "Espace Sécurisé des Partenaires & de la Direction Générale": { en: "Secure Space for Partners & General Management", ar: "المساحة الآمنة للشركاء والإدارة العامة", es: "Espacio Seguro de Socios y Dirección General" },
      "Espace Client": { en: "Customer Space", ar: "مساحة العميل", es: "Espacio Cliente" },
      "Espace Distributeur": { en: "Distributor Space", ar: "مساحة الموزع", es: "Espacio Distribuidor" },
      "Identifiant Administrateur :": { en: "Administrator ID:", ar: "معرف المشرف:", es: "ID Administrador:" },
      "Identifiant 100% Numérique (chiffres uniquement) :": { en: "100% Numeric Identifier (digits only):", ar: "المعرف الرقمي (أرقام فقط):", es: "Identificador 100% Numérico (solo dígitos):" },
      "Code Client (chiffres) :": { en: "Customer ID (digits):", ar: "رمز العميل (أرقام):", es: "Código de Cliente (dígitos):" },
      "Mot de passe :": { en: "Password:", ar: "كلمة المرور:", es: "Contraseña:" },
      "Mémoriser mes identifiants": { en: "Remember my credentials", ar: "تذكر بياناتي", es: "Recordar mis datos" },
      "Connexion Direction Générale (Admin)": { en: "Login General Management (Admin)", ar: "دخول الإدارة العامة (مشرف)", es: "Entrar Dirección General (Admin)" },
      "Connexion Espace Distributeur": { en: "Login Distributor Space", ar: "دخول مساحة الموزع", es: "Entrar Espacio Distribuidor" },
      "Connexion Espace Client Privilège": { en: "Login Privilege Customer Space", ar: "دخول مساحة العميل المميز", es: "Entrar Espacio Cliente Privilegiado" },
      "Nouveau Client Privilège Routini ?": { en: "New Routini Privilege Customer?", ar: "عميل مميز جديد لدى روتيني؟", es: "¿Nuevo Cliente Privilegiado Routini?" },
      "Commandez directement avec 10% de réduction et cumulez vos points fidélité !": {
        en: "Order directly with 10% discount and earn loyalty points!",
        ar: "اطلب مباشرة بخصم 10% واجمع نقاط الولاء!",
        es: "¡Pida directamente con 10% de descuento y acumule puntos de fidelidad!"
      },
      "Créer mon Compte Client (Gratuit)": { en: "Create Customer Account (Free)", ar: "إنشاء حساب عميل (مجاناً)", es: "Crear Cuenta de Cliente (Gratis)" },
      "Connexion Rapide Démo :": { en: "Quick Demo Login:", ar: "تسجيل دخول تجريبي سريع:", es: "Inicio Rápido Demo:" },

      // Boutique & Panier
      "Catalogue Soins & Rituels Cosmétiques": { en: "Skincare & Cosmetics Catalog", ar: "كتالوج العناية ومستحضرات التجميل", es: "Catálogo de Cuidados y Cosméticos" },
      "Tous les Soins": { en: "All Products", ar: "جميع المستحضرات", es: "Todos los Productos" },
      "Sérums & Huiles": { en: "Serums & Oils", ar: "السيروم والزيوت", es: "Sérums y Aceites" },
      "Crèmes & Visage": { en: "Creams & Face", ar: "الكريمات والوجه", es: "Cremas y Rostro" },
      "Packs & Rituels": { en: "Packs & Rituals", ar: "الباقات والمجموعات", es: "Packs y Rituales" },
      "Ajouter au Panier": { en: "Add to Cart", ar: "أضف إلى السلة", es: "Añadir al Carrito" },
      "Ajouter ce Pack": { en: "Add this Pack", ar: "أضف هذه الباقة", es: "Añadir este Pack" },
      "Votre Panier Routini": { en: "Your Routini Cart", ar: "سلتك روتيني", es: "Su Carrito Routini" },
      "Votre panier est vide.": { en: "Your cart is empty.", ar: "سلتك فارغة.", es: "Su carrito está vacío." },
      "Sous-total articles :": { en: "Items subtotal:", ar: "المجموع الفرعي:", es: "Subtotal artículos:" },
      "Remise Client Privilège (-10%) :": { en: "Privilege Customer Discount (-10%):", ar: "خصم العميل المميز (-10%):", es: "Descuento Cliente Privilegiado (-10%):" },
      "Frais de Livraison Amana Express (Fixe) :": { en: "Amana Express Delivery Fees (Fixed):", ar: "مصاريف شحن أمانة إكسبريس (ثابتة):", es: "Gastos de Envío Amana Express (Fijo):" },
      "Total Net TTC à Régler :": { en: "Total Net to Pay:", ar: "الإجمالي الصافي للدفع:", es: "Total Neto a Pagar:" },
      "Points Fidélité Gagnés :": { en: "Loyalty Points Earned:", ar: "نقاط الولاء المكتسبة:", es: "Puntos de Fidelidad Ganados:" },
      "Valider et Confirmer la Commande": { en: "Validate and Confirm Order", ar: "تأكيد وإرسال الطلب", es: "Validar y Confirmar el Pedido" },
      "Vider le Panier": { en: "Clear Cart", ar: "إفراغ السلة", es: "Vaciar el Carrito" },

      // Facture & Modales
      "Facture Officielle Routini eWorld": { en: "Official Routini eWorld Invoice", ar: "فاتورة رسمية روتيني إي-وورلد", es: "Factura Oficial Routini eWorld" },
      "Imprimer / Télécharger PDF": { en: "Print / Download PDF", ar: "طباعة / تحميل PDF", es: "Imprimir / Descargar PDF" },
      "Articles & Soins": { en: "Items & Care", ar: "المستحضرات والمنتجات", es: "Artículos y Cuidados" },
      "Quantité": { en: "Quantity", ar: "الكمية", es: "Cantidad" },
      "Prix Unitaire": { en: "Unit Price", ar: "سعر الوحدة", es: "Precio Unitario" },
      "Total Ligne": { en: "Line Total", ar: "مجموع السطر", es: "Total Línea" },
      "Annuler": { en: "Cancel", ar: "إلغاء", es: "Cancelar" },
      "Fermer": { en: "Close", ar: "إغلاق", es: "Cerrar" },
      "Valider": { en: "Confirm", ar: "تأكيد", es: "Confirmar" },
      "Rechercher nom, code, rang, ville...": { en: "Search name, ID, rank, city...", ar: "بحث عن الاسم، الرمز، الرتبة، المدينة...", es: "Buscar nombre, código, rango, ciudad..." },
      "Mon Espace Client Privilège Routini": { en: "My Routini Privilege Customer Space", ar: "مساحة العميل المميز روتيني", es: "Mi Espacio Cliente Privilegiado Routini" },
      "Suivi de vos commandes soins, expéditions Amana Express et solde fidélité": { en: "Tracking your skincare orders, Amana shipments and loyalty balance", ar: "تتبع طلبات العناية، شحنات أمانة ورصيد الولاء", es: "Seguimiento de sus pedidos, envíos Amana y saldo de fidelidad" },
      "Tableau de Bord ROUTINI ONE PLAN V4": { en: "ROUTINI ONE PLAN V4 Dashboard", ar: "لوحة تحكم روتيني ون بلان V4", es: "Panel de Control ROUTINI ONE PLAN V4" },
      "Aperçu général de vos performances, ventes et qualifications (Septembre 2026)": { en: "Overview of your performance, sales and qualifications (September 2026)", ar: "نظرة عامة على أدائك ومبيعاتك ومؤهلاتك (سبتمبر 2026)", es: "Resumen de su rendimiento, ventas y calificaciones" },
      "Arbre Généalogique & Réseau": { en: "Genealogy Tree & Network", ar: "شجرة الشبكة والأعضاء", es: "Árbol Genealógico y Red" },
      "Suivi sur 3 niveaux (N1 10%, N2 5%, N3 3%) et bonus Leadership (1% à 7%)": { en: "3-level tracking (L1 10%, L2 5%, L3 3%) & Leadership bonus (1% to 7%)", ar: "متابعة 3 مستويات (N1 10%, N2 5%, N3 3%) وعلاوة القيادة (1% إلى 7%)", es: "Seguimiento en 3 niveles (N1 10%, N2 5%, N3 3%) y bono de Liderazgo (1% al 7%)" },
      "Boutique Soins & Packs Routines": { en: "Skincare & Routine Packs Store", ar: "متجر العناية ومجموعات الطقوس", es: "Tienda de Cuidados y Packs de Rutinas" },
      "Boutique Cosmétiques & Packs Routines": { en: "Cosmetics Store & Routine Packs", ar: "متجر مستحضرات التجميل والطقوس", es: "Tienda de Cosméticos y Packs de Rutinas" },
      "Commandez vos rituels au Prix Public avec livraison express et points fidélité": { en: "Order rituals at Retail Price with express delivery & loyalty points", ar: "اطلب طقوسك بسعر الجمهور مع توصيل سريع ونقاط ولاء", es: "Pida sus rituales al Precio Público con envío exprés y puntos de fidelidad" },
      "Soins de beauté au Prix Membre (90% PP), points PV (PP/10) et CV (60% PM)": { en: "Beauty care at Member Price (90% RP), PV points (RP/10) and CV (60% MP)", ar: "مستحضرات بسعر العضو (90% PP)، ونقاط PV ونقاط CV (60% PM)", es: "Cosméticos al Precio Miembro (90% PP), puntos PV (PP/10) y CV (60% PM)" },
      "Portefeuille E-Point & Commissions": { en: "E-Point Wallet & Commissions", ar: "محفظة النقاط الإلكترونية والعمولات", es: "Billetera E-Point y Comisiones" },
      "Simulations officielles 3 mois (Slide 11), objectif 10 000 DH (Slide 13) et relevés": { en: "Official 3-month simulations (Slide 11), 10,000 MAD goal (Slide 13) and statements", ar: "محاكاة 3 أشهر الرسمية، هدف 10,000 درهم وكشوفات الحساب", es: "Simulaciones oficiales de 3 meses, meta de 10.000 DH y extractos" },
      "Parrainage & Inscription Partenaire (0 DH)": { en: "Partner Sponsorship & Registration (0 MAD)", ar: "رعاية وتسجيل الشركاء (0 درهم)", es: "Patrocinio e Inscripción de Socio (0 DH)" },
      "Adhésion gratuite sans achat forcé • Seule la vente de soins déclenche la prime": { en: "Free membership without forced purchase • Skincare sales only trigger bonus", ar: "تسجيل مجاني بدون شراء إجباري • مبيعات المستحضرات تفعل المكافأة", es: "Inscripción gratuita sin compra obligatoria • Solo las ventas activan el bono" },
      "Direction Générale Routini": { en: "Routini General Management", ar: "الإدارة العامة روتيني", es: "Dirección General Routini" },
      "Contrôle central, barème V4 (PM 90%, CV 60%), stress test financier et solidité": { en: "Central governance, V4 scale (MP 90%, CV 60%), financial stress testing", ar: "التحكم المركزي، جدول V4 واختبارات القوة والمتانة المالية", es: "Control central, baremo V4 (PM 90%, CV 60%), test de solidez financiera" },
      "Star Diamond": { en: "Star Diamond", ar: "نجم ماسي", es: "Diamante Estrella" },
      "Star Ruby": { en: "Star Ruby", ar: "نجم ياقوتي", es: "Rubí Estrella" },
      "Star Agent": { en: "Star Agent", ar: "وكيل نجم", es: "Agente Estrella" },
      "Client Privilège": { en: "Privilege Customer", ar: "عميل مميز", es: "Cliente Privilegiado" },
      "● Actif Qualifié": { en: "● Qualified Active", ar: "● نشط ومؤهل", es: "● Activo Calificado" },
      "● Distributeur Actif Qualifié": { en: "● Qualified Active Distributor", ar: "● موزع نشط ومؤهل", es: "● Distribuidor Activo Calificado" },
      "⚠ Inactif": { en: "⚠ Inactive", ar: "⚠ غير نشط", es: "⚠ Inactivo" },
      "complété": { en: "completed", ar: "مكتمل", es: "completado" },
      "Filleuls": { en: "Downlines", ar: "الأعضاء", es: "Afiliados" },
      "actifs": { en: "active", ar: "نشط", es: "activos" },
      "Aucun colis": { en: "No parcel", ar: "لا توجد طرود", es: "Sin paquete" },
      "Prêt pour commande": { en: "Ready to order", ar: "جاهز للطلب", es: "Listo para pedir" },
      "Poste Maroc (Amana)": { en: "Morocco Post (Amana)", ar: "بريد المغرب (أمانة)", es: "Correos Marruecos (Amana)" },
      "ami(s) parrainé(s)": { en: "referred friend(s)", ar: "صديق محال", es: "amigo(s) patrocinado(s)" },
      "Validé (12 mois)": { en: "Validated (12 months)", ar: "مؤكد (12 شهراً)", es: "Validado (12 meses)" },
      "Vous n'avez pas encore passé de commande sur votre compte client.": { en: "You haven't placed any orders on your customer account yet.", ar: "لم تقم بأي طلب على حسابك بعد.", es: "Aún no ha realizado ningún pedido en su cuenta de cliente." },
      "Découvrir les Soins & Rituels": { en: "Discover Skincare & Rituals", ar: "اكتشاف المستحضرات والطقوس", es: "Descubrir Cuidados y Rituales" },
      "soin(s) de beauté": { en: "beauty product(s)", ar: "منتجات تجميل", es: "producto(s) de belleza" },
      "Prix Membre (90% PP)": { en: "Member Price (90% RP)", ar: "سعر العضو (90% PP)", es: "Precio Miembro (90% PP)" },
      "Prix Public": { en: "Retail Price", ar: "سعر الجمهور", es: "Precio Público" },
      "Économie immédiate :": { en: "Immediate saving:", ar: "توفير فوري:", es: "Ahorro inmediato:" },
      "Remise :": { en: "Discount:", ar: "الخصم:", es: "Descuento:" },
      "Base com. :": { en: "Com. base:", ar: "أساس العمولة:", es: "Base com.:" },
      "Fidélité :": { en: "Loyalty:", ar: "الولاء:", es: "Fidelidad:" },
      "Stock :": { en: "Stock:", ar: "المخزون:", es: "Stock:" },
      "Profiter de ce Pack Promo": { en: "Get this Promo Pack", ar: "الاستفادة من هذه الباقة الترويجية", es: "Aprovechar este Pack Promo" },
      "Canal de commande :": { en: "Order channel:", ar: "قناة الطلب:", es: "Canal de pedido:" },
      "Client Rattaché": { en: "Attached Customer", ar: "عميل مرتبط", es: "Cliente Vinculado" },
      "Achat Partenaire": { en: "Partner Purchase", ar: "شراء شريك", es: "Compra Socio" },
      "Prix Vente Public Recommandé (PP)": { en: "Recommended Retail Price (RP)", ar: "سعر البيع للجمهور الموصى به", es: "Precio Venta Público Recomendado (PP)" },
      "Commission Value = 60% du Prix Membre": { en: "Commission Value = 60% of Member Price", ar: "قيمة العمولة = 60% من سعر العضو", es: "Commission Value = 60% del Precio Miembro" },
      "1 PV = 10 DH Prix Public": { en: "1 PV = 10 MAD Retail Price", ar: "1 PV = 10 دراهم سعر الجمهور", es: "1 PV = 10 DH Precio Público" },
      "Commandez directement sans parrainage ni réseau MLM.": { en: "Order directly without sponsorship or MLM network.", ar: "اطلب مباشرة بدون استضافة أو شبكة تسويق.", es: "Pida directamente sin patrocinio ni red MLM." },
      "+50 points fidélité offerts": { en: "+50 loyalty points offered", ar: "+50 نقطة ولاء مهداة", es: "+50 puntos de fidelidad de regalo" },
      "immédiatement à l'inscription !": { en: "immediately upon registration!", ar: "مباشرة عند التسجيل!", es: "¡inmediatamente al registrarse!" },
      "Choisir un profil client pour tester :": { en: "Choose a demo profile to test:", ar: "اختر حساباً تجريبياً للاختبار:", es: "Elegir un perfil de prueba:" },
      "Pré-remplit automatiquement le code et le mot de passe du partenaire.": { en: "Automatically prefills partner code and password.", ar: "يملأ تلقائياً رمز وكلمة مرور الشريك.", es: "Rellena automáticamente el código y la contraseña." },
      "Réseau actif : 50 membres • 6 mois": { en: "Active network: 50 members • 6 months", ar: "شبكة نشطة: 50 عضواً • 6 أشهر", es: "Red activa: 50 miembros • 6 meses" },
      "Connexion Rapide en 1-Clic :": { en: "1-Click Quick Login:", ar: "تسجيل دخول سريع بنقرة واحدة:", es: "Conexión Rápida en 1 Clic:" },
      "Niveau 1": { en: "Level 1", ar: "المستوى 1", es: "Nivel 1" },
      "Niveau 2": { en: "Level 2", ar: "المستوى 2", es: "Nivel 2" },
      "Niveau 3": { en: "Level 3", ar: "المستوى 3", es: "Nivel 3" },
      "Niveau": { en: "Level", ar: "المستوى", es: "Nivel" },
      "Génération": { en: "Generation", ar: "الجيل", es: "Generación" },
      "Palier Suprême 7% Leadership": { en: "Supreme Level 7% Leadership", ar: "المستوى الأعلى 7% قيادة", es: "Nivel Supremo 7% Liderazgo" },
      "Simulations Officielles 3 Mois": { en: "Official 3-Month Simulations", ar: "محاكاة 3 أشهر الرسمية", es: "Simulaciones Oficiales 3 Meses" },
      "Mois 1": { en: "Month 1", ar: "الشهر 1", es: "Mes 1" },
      "Mois 2": { en: "Month 2", ar: "الشهر 2", es: "Mes 2" },
      "Mois 3": { en: "Month 3", ar: "الشهر 3", es: "Mes 3" },
      "Total Commissions Reversées": { en: "Total Commissions Paid", ar: "مجموع العمولات المصروفة", es: "Total Comisiones Pagadas" },
      "Chiffre d'Affaires Global Réseau": { en: "Global Network Turnover", ar: "رقم المعاملات الإجمالي للشبكة", es: "Facturación Global de la Red" },
      "Solidité Financière & Stress Test": { en: "Financial Strength & Stress Test", ar: "القوة والمتانة المالية واختبار الضغط", es: "Solidez Financiera y Test de Estrés" },
      "Créer un Nouveau Produit": { en: "Create New Product", ar: "إنشاء منتج جديد", es: "Crear Nuevo Producto" },
      "Créer un Pack de Produits": { en: "Create Product Pack", ar: "إنشاء باقة منتجات", es: "Crear Pack de Productos" },
      "Gestion des Distributeurs & Rangs": { en: "Distributors & Ranks Management", ar: "إدارة الموزعين والرتب", es: "Gestión de Distribuidores y Rangos" },
      "Modifier": { en: "Edit", ar: "تعديل", es: "Modificar" },
      "Supprimer": { en: "Delete", ar: "حذف", es: "Eliminar" },
      "Dupliquer": { en: "Duplicate", ar: "نسخ", es: "Duplicar" },
      "Actif": { en: "Active", ar: "نشط", es: "Activo" },
      "Inactif": { en: "Inactive", ar: "غير نشط", es: "Inactivo" },
      "Carte Bancaire CMI (Maroc)": { en: "Credit Card CMI (Morocco)", ar: "بطاقة بنكية CMI (المغرب)", es: "Tarjeta Bancaria CMI (Marruecos)" },
      "Paiement à la Livraison (COD)": { en: "Cash on Delivery (COD)", ar: "الدفع عند الاستلام", es: "Pago Contra Reembolso" },
      "Carte Bancaire": { en: "Credit Card", ar: "بطاقة بنكية", es: "Tarjeta Bancaria" },
      "Virement Bancaire": { en: "Bank Transfer", ar: "تحويل بنكي", es: "Transferencia Bancaria" }
    };
  }

  setLanguage(lang) {
    if (!this.translations[lang]) lang = 'fr';
    this.currentLang = lang;
    localStorage.setItem('ROUTINI_LANG', lang);

    const isRTL = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (isRTL) {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }

    // 1. Re-rendre les vues (ce qui régénère le DOM avec les textes frais)
    if (window.app && window.app.renderAllViews) {
      window.app.renderAllViews();
    } else {
      this.translateDOM();
    }

    // 2. Traduire l'ensemble de l'arbre DOM
    this.translateDOM();

    // 3. Mettre à jour l'état visuel actif de tous les sélecteurs de langue
    document.querySelectorAll('.btn-lang-flag').forEach(b => {
      if (b.getAttribute('data-lang') === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // 4. Toast de confirmation
    const langNames = {
      fr: 'Langue activée : Français 🇲🇦',
      en: 'Language activated: English 🇬🇧',
      ar: 'تم تفعيل اللغة: العربية 🇸🇦',
      es: 'Idioma activado: Español 🇪🇸'
    };
    if (window.app && window.app.showToast) {
      window.app.showToast(langNames[lang] || lang, 'info');
    }
  }

  t(key, fallback = '') {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    return dict[key] || (this.translations.fr[key] || fallback || key);
  }

  findFrenchOrigin(text) {
    if (!this._reverseMap) {
      this._reverseMap = {};
      for (const [fr, dict] of Object.entries(this.phraseMap)) {
        for (const [l, trans] of Object.entries(dict)) {
          if (trans && typeof trans === 'string') {
            this._reverseMap[trans.trim()] = fr;
          }
        }
      }
    }
    return this._reverseMap[text] || null;
  }

  translateDOM() {
    const lang = this.currentLang;
    const isRTL = lang === 'ar';
    const doc = document.documentElement;
    const body = document.body;

    doc.setAttribute('lang', lang);
    doc.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (isRTL) {
      body.classList.add('rtl-mode');
    } else {
      body.classList.remove('rtl-mode');
    }

    // 1. [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const tr = this.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', tr);
        } else {
          el.textContent = tr;
        }
      }
    });

    // 2. [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', this.t(key));
    });

    // 3. Traduction intégrale via TreeWalker sur tous les nœuds de texte
    this.translateAllTextNodes(lang);

    // 4. Traduction des placeholders et inputs
    this.translateInputsAndTooltips(lang);

    // 5. Mettre à jour l'état actif sur les drapeaux
    document.querySelectorAll('.btn-lang-flag').forEach(b => {
      if (b.getAttribute('data-lang') === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // 6. Synchroniser avec les titres d'en-tête
    if (window.app && window.app.updateHeaderTitle) {
      window.app.updateHeaderTitle(window.app.currentView || 'dashboard');
    }
  }

  translateAllTextNodes(lang) {
    if (!this.phraseMap) return;

    const rootContainers = [
      document.getElementById('quickRoleBar'),
      document.getElementById('authSection'),
      document.getElementById('appMainLayout'),
      document.getElementById('appModal'),
      document.getElementById('modalRegisterClient'),
      document.querySelector('.mobile-bottom-nav')
    ].filter(Boolean);

    rootContainers.forEach(container => {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE') return NodeFilter.FILTER_REJECT;
            if (parent.closest('.header-lang-selector, .quick-lang-selector, .auth-lang-selector')) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let textNode;
      while ((textNode = walker.nextNode())) {
        const raw = textNode.nodeValue;
        const trimmed = raw.trim();

        if (textNode._frOrig === undefined) {
          if (this.phraseMap[trimmed]) {
            textNode._frOrig = trimmed;
          } else {
            const matchedFr = this.findFrenchOrigin(trimmed);
            textNode._frOrig = matchedFr || trimmed;
          }
        }

        const fr = textNode._frOrig;
        if (!fr) continue;

        if (lang === 'fr') {
          if (trimmed !== fr) {
            textNode.nodeValue = raw.replace(trimmed, fr);
          }
        } else if (this.phraseMap[fr] && this.phraseMap[fr][lang]) {
          const translated = this.phraseMap[fr][lang];
          if (trimmed !== translated) {
            textNode.nodeValue = raw.replace(trimmed, translated);
          }
        }
      }
    });
  }

  translateInputsAndTooltips(lang) {
    if (!this.phraseMap) return;

    // Placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(inp => {
      if (inp._frOrigPh === undefined) {
        const ph = (inp.getAttribute('placeholder') || '').trim();
        if (this.phraseMap[ph]) {
          inp._frOrigPh = ph;
        } else {
          inp._frOrigPh = this.findFrenchOrigin(ph) || ph;
        }
      }
      const frPh = inp._frOrigPh;
      if (!frPh) return;

      if (lang === 'fr') {
        inp.setAttribute('placeholder', frPh);
      } else if (this.phraseMap[frPh] && this.phraseMap[frPh][lang]) {
        inp.setAttribute('placeholder', this.phraseMap[frPh][lang]);
      }
    });

    // Boutons de formulaires (submit / button avec value)
    document.querySelectorAll('input[type="submit"], input[type="button"]').forEach(btn => {
      const val = (btn.value || '').trim();
      if (!btn._frOrigVal) {
        btn._frOrigVal = this.phraseMap[val] ? val : (this.findFrenchOrigin(val) || val);
      }
      const frVal = btn._frOrigVal;
      if (!frVal) return;

      if (lang === 'fr') {
        btn.value = frVal;
      } else if (this.phraseMap[frVal] && this.phraseMap[frVal][lang]) {
        btn.value = this.phraseMap[frVal][lang];
      }
    });

    // Tooltips [title]
    document.querySelectorAll('[title]').forEach(el => {
      const t = (el.getAttribute('title') || '').trim();
      if (!t) return;
      if (el.closest('.header-lang-selector, .quick-lang-selector, .auth-lang-selector')) return;

      if (!el._frOrigTitle) {
        el._frOrigTitle = this.phraseMap[t] ? t : (this.findFrenchOrigin(t) || t);
      }
      const frT = el._frOrigTitle;
      if (!frT) return;

      if (lang === 'fr') {
        el.setAttribute('title', frT);
      } else if (this.phraseMap[frT] && this.phraseMap[frT][lang]) {
        el.setAttribute('title', this.phraseMap[frT][lang]);
      }
    });
  }
}

window.i18n = new I18nManager();

// Initialisation dès chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.i18n) window.i18n.translateDOM();
  });
} else {
  if (window.i18n) window.i18n.translateDOM();
}
