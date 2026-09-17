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
  }

  setLanguage(lang) {
    if (!this.translations[lang]) lang = 'fr';
    this.currentLang = lang;
    localStorage.setItem('ROUTINI_LANG', lang);

    const doc = document.documentElement;
    const body = document.body;
    const currentConfig = this.translations[lang];

    doc.setAttribute('lang', lang);
    doc.setAttribute('dir', currentConfig.dir);
    if (currentConfig.dir === 'rtl') {
      body.classList.add('rtl-mode');
    } else {
      body.classList.remove('rtl-mode');
    }

    this.translateDOM();

    if (window.app) {
      window.app.renderAllViews();
    }
  }

  t(key, fallback = '') {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    return dict[key] || (this.translations.fr[key] || fallback || key);
  }

  translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', translation);
        } else {
          el.textContent = translation;
        }
      }
    });

    const currentFlagEl = document.getElementById('currentLangFlag');
    const currentCodeEl = document.getElementById('currentLangCode');
    if (currentFlagEl) currentFlagEl.textContent = this.translations[this.currentLang].flag;
    if (currentCodeEl) currentCodeEl.textContent = this.currentLang.toUpperCase();
  }
}

window.i18n = new I18nManager();
