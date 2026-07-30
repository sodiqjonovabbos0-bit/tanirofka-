'use strict';

const API_BASE = (() => {
  const isFile = window.location.protocol === 'file:';
  const isLocalAltPort = ['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port && window.location.port !== '3000';
  return isFile || isLocalAltPort ? 'http://localhost:3000' : '';
})();

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

const CONFIG = {
  phoneDisplay: '+998 99 127 24 37',
  phoneHref: '+998991272437'
};

const TRANSLATIONS = {
  uz: {
    'promo.badge':'AKSIYA','promo.text':'Tanirovka + ximchistkaga maxsus chegirma','promo.cta':'Buyurtma berish',
    'menu.label':'MENYU','nav.home':'Bosh sahifa','nav.services':'Xizmatlar','nav.prices':'Narxlar','nav.guarantee':'Kafolat','nav.faq':'Savollar','nav.order':'Buyurtma','nav.contact':'Manzil','nav.admin':'Admin','theme.label':'Sayt rangi','theme.short':'Rang',
    'hero.eyebrow':'AVTOMOBIL XIZMATLARI','hero.title':'Avtomobilingiz uchun <em>5 ta asosiy xizmat</em>','hero.text':'Tanirovka, sonsa zashitka, salon laminatsiya, bron plyonka va ximchistka. Narxni avtomobil holatiga qarab kelishamiz va imkon qadar qulay narx beramiz.','hero.trust1':'Sifatli material','hero.trust2':'Tezkor xizmat','hero.trust3':'Kelishilgan narx','hero.servicesCta':'Xizmatlarni ko‘rish','hero.orderCta':'Buyurtma berish',
    'summary.tint':'01 — Tanirovka','summary.sun':'02 — Sonsa zashitka','summary.lam':'03 — Salon laminatsiya','summary.ppf':'04 — Bron plyonka','summary.clean':'05 — Ximchistka',
    'services.eyebrow':'ASOSIY XIZMATLAR','services.title':'Bizda quyidagi xizmatlar bor','services.text':'Har bir xizmat haqida aniq va tushunarli ma’lumot.',
    'service.tint.name':'Tanirovka','service.tint.text':'Avtomobil oynalariga professional tanirovka o‘rnatamiz. Narxi avtomobil turi va tanlangan plyonkaga qarab kelishiladi.','service.tint.types':'Tanirovka turlari:',
    'service.sun.name':'Sonsa zashitka','service.sun.text':'Llumar AIR 80 sonsa zashitkasi avtomobilga o‘rnatilganda quyosh va issiqlikdan taxminan <strong>96–97%</strong> himoya qiladi. Oynani keskin qoraytirmaydi.',
    'service.lam.name':'Salon laminatsiya','service.lam.400':'Joyida qilinadi. Salon detallari yechilmaydi.','service.lam.800':'Detallari yechib olinib, alohida ishlanadi.',
    'service.ppf.name':'Bron plyonka','service.ppf.text':'Bron plyonka avtomobilning qaysi joylariga qilinishiga qarab narxni kelishamiz va sizga qulay, arzon narx beramiz.',
    'service.clean.name':'Ximchistka','service.clean.text':'Avtomobil salonini to‘liq ximchistka qilib, bozorga tayyor holatga keltiramiz. O‘rindiq, pol, shift, eshik ichki qismlari, panel va bagaj tozalanadi.','service.clean.price':'800 000 so‘mdan 100$ gacha','service.clean.note':'Yakuniy narx avtomobilning holati va ifloslanishiga qarab kelishiladi.',
    'time.1to2':'1–2 soat','time.3to6':'3–6 soat','time.5to8':'5–8 soat','time.byPart':'Qismiga qarab',
    'price.carDependent':'Narxi avtomobilga qarab kelishiladi.','price.negotiable':'Narxi — kelishiladi.','price.negotiableShort':'Kelishiladi',
    'part.hood':'Kapot','part.bumper':'Old bamper','part.lights':'Faralar','part.mirrors':'Ko‘zgular','part.handles':'Eshik tutqichlari','part.full':'To‘liq kuzov',
    'prices.eyebrow':'NARX VA VAQT','prices.title':'Qisqa narxlar ro‘yxati','prices.sunDesc':'Llumar AIR 80 — 96–97% himoya','prices.lamDesc':'Joyida / yechib qilinadi','prices.ppfDesc':'Tanlangan qismlarga qarab','prices.cleanDesc':'Bozorga tayyor qilib berish',
    'guarantee.eyebrow':'KAFOLAT MUDDATI','guarantee.title':'Kafolat xizmat va materialga qarab belgilanadi','guarantee.text':'Aniq kafolat muddati tanlangan material va bajariladigan ishga qarab xizmat boshlanishidan oldin aytiladi.','guarantee.tintTitle':'Tanirovka va Llumar AIR 80','guarantee.tintText':'Kafolat muddati tanlangan plyonka turiga qarab belgilanadi.','guarantee.lamTitle':'Salon laminatsiya','guarantee.lamText':'Kafolat tanlangan 400 000 yoki 800 000 so‘mlik xizmat variantiga qarab aytiladi.','guarantee.ppfTitle':'Bron plyonka','guarantee.ppfText':'Kafolat plyonka materiali va qoplangan qismlarga qarab belgilanadi.','guarantee.cleanTitle':'Ximchistka','guarantee.cleanText':'Ish topshirilishidan oldin salon mijoz bilan birga tekshiriladi.',
    'faq.eyebrow':'KO‘P BERILADIGAN SAVOLLAR','faq.title':'Savollarga javob','faq.q1':'Tanirovka qancha vaqtda qilinadi?','faq.a1':'Odatda 1–2 soat. Vaqt avtomobil va oynalar soniga qarab o‘zgarishi mumkin.','faq.q2':'Qaysi tanirovka turini tanlash kerak?','faq.a2':'Budjet va kerakli himoya darajasiga qarab Armalan, Americanskiy, Nano Ceramic, Koreyskiy yoki Dubayskiy tanlanadi.','faq.q3':'Llumar AIR 80 oynani qoraytiradimi?','faq.a3':'Oynani keskin qoraytirmaydi. Asosiy vazifasi quyosh va issiqlikdan 96–97% gacha himoya qilishdir.','faq.q4':'400 ming va 800 ming laminatsiya farqi nima?','faq.a4':'400 000 so‘mlik xizmat joyida qilinadi. 800 000 so‘mlik xizmatda detallar yechib olinib, alohida ishlanadi.','faq.q5':'Bron plyonka narxi qanday aniqlanadi?','faq.a5':'Narx qoplanadigan qismlar, avtomobil turi va tanlangan materialga qarab kelishiladi.',
    'order.eyebrow':'BUYURTMA','order.title':'Buyurtma qoldiring','order.text':'Ma’lumotlarni yuboring. Administrator buyurtmani ko‘rib siz bilan bog‘lanadi.','order.phoneHelp':'Telefon orqali ham buyurtma berish mumkin:','order.submit':'Buyurtmani yuborish','order.sending':'Yuborilmoqda...','order.success':'Buyurtmangiz qabul qilindi.','order.formEyebrow':'BUYURTMA MA’LUMOTLARI','order.formTitle':'Formani to‘ldiring — biz sizga qo‘ng‘iroq qilamiz','order.formText':'Ma’lumotlar administratorga tushadi. Narx va kelish vaqtini telefon orqali aniqlashtiramiz.','order.step1':'1. Ma’lumot kiriting','order.step2':'2. Buyurtmani yuboring','order.step3':'3. Qo‘ng‘iroqni kuting',
    'form.name':'Ismingiz *','form.namePlaceholder':'Ismingiz','form.phone':'Telefon raqami *','form.phoneHint':'Masalan: +998 90 123 45 67','form.brand':'Avtomobil markasi *','form.brandPlaceholder':'Masalan: Chevrolet','form.model':'Avtomobil modeli','form.modelPlaceholder':'Masalan: Cobalt','form.service':'Xizmat turi *','form.selectService':'Xizmatni tanlang','form.sunOption':'Sonsa zashitka — Llumar AIR 80','form.tintType':'Tanirovka turi','form.selectType':'Turini tanlang','form.lamType':'Laminatsiya turi','form.lam400':'400 000 so‘m — joyida qilinadi','form.lam800':'800 000 so‘m — detallar yechib qilinadi','form.ppfParts':'Bron plyonka qilinadigan qismlar','form.comment':'Qo‘shimcha izoh','form.commentPlaceholder':'Avtomobil holati yoki boshqa ma’lumot',
    'error.name':'Ismingizni to‘g‘ri kiriting.','error.phone':'Telefon raqamingizni +998 90 123 45 67 ko‘rinishida to‘liq kiriting.','error.brand':'Avtomobil markasini kiriting.','error.service':'Xizmat turini tanlang.','error.server':'Server bilan aloqa bo‘lmadi.',
    'contact.telegram':'Telegram','contact.instagram':'Instagram','contact.eyebrow':'ANIQ MANZIL VA XARITA','contact.title':'Bizni xaritadan toping','contact.text':'Telefon orqali bog‘laning yoki quyidagi xarita orqali manzilimizni oching.','contact.phone':'Telefon','contact.address':'Aniq manzil','contact.hours':'Ish vaqti','contact.hoursValue':'Har kuni: 09:00–20:00','contact.openMap':'Xaritada ochish',
    'footer.text':'Professional avtomobil xizmatlari.','mobile.call':'Hozir qo‘ng‘iroq qilish','mobile.order':'Buyurtma','pwa.install':'Telefonga o‘rnatish','pwa.installed':'Ilova o‘rnatilgan','pwa.eyebrow':'MOBIL ILOVA','pwa.title':'TANIROVKA’ni telefon ekraniga qo‘shing','pwa.androidHelp':'Chrome menyusidan “Ilovani o‘rnatish” yoki “Bosh ekranga qo‘shish”ni tanlang.','pwa.iosHelp':'Safari pastidagi Ulashish tugmasini bosing, so‘ng “Bosh ekranga qo‘shish”ni tanlang.','pwa.tryInstall':'O‘rnatishni ochish','pwa.secureHint':'O‘rnatish uchun sayt HTTPS manzilda ochilgan bo‘lishi kerak.','aria.menuOpen':'Menyuni ochish','aria.menuClose':'Menyuni yopish'
  },
  ru: {
    'promo.badge':'АКЦИЯ','promo.text':'Специальная скидка на тонировку + химчистку','promo.cta':'Оставить заявку',
    'menu.label':'МЕНЮ','nav.home':'Главная','nav.services':'Услуги','nav.prices':'Цены','nav.guarantee':'Гарантия','nav.faq':'Вопросы','nav.order':'Заявка','nav.contact':'Адрес','nav.admin':'Админ','theme.label':'Цвет сайта','theme.short':'Цвет',
    'hero.eyebrow':'АВТОМОБИЛЬНЫЕ УСЛУГИ','hero.title':'Для вашего автомобиля — <em>5 основных услуг</em>','hero.text':'Тонировка, защита от солнца, ламинация салона, бронеплёнка и химчистка. Итоговую цену согласуем с учётом состояния автомобиля и предложим удобную стоимость.','hero.trust1':'Качественные материалы','hero.trust2':'Быстрый сервис','hero.trust3':'Согласованная цена','hero.servicesCta':'Посмотреть услуги','hero.orderCta':'Оставить заявку',
    'summary.tint':'01 — Тонировка','summary.sun':'02 — Защита от солнца','summary.lam':'03 — Ламинация салона','summary.ppf':'04 — Бронеплёнка','summary.clean':'05 — Химчистка',
    'services.eyebrow':'ОСНОВНЫЕ УСЛУГИ','services.title':'Наши услуги','services.text':'Понятная и точная информация по каждой услуге.',
    'service.tint.name':'Тонировка','service.tint.text':'Профессионально устанавливаем тонировку на автомобильные стёкла. Цена зависит от автомобиля и выбранной плёнки.','service.tint.types':'Виды тонировки:',
    'service.sun.name':'Защита от солнца','service.sun.text':'Плёнка Llumar AIR 80 после установки защищает салон от солнца и тепла примерно на <strong>96–97%</strong>, не делая стекло сильно тёмным.',
    'service.lam.name':'Ламинация салона','service.lam.400':'Выполняется на месте без снятия деталей салона.','service.lam.800':'Детали снимаются и обрабатываются отдельно.',
    'service.ppf.name':'Бронеплёнка','service.ppf.text':'Стоимость зависит от того, какие части автомобиля будут оклеены. Предложим удобную и доступную цену.',
    'service.clean.name':'Химчистка','service.clean.text':'Полностью очищаем салон и готовим автомобиль к продаже. Чистим сиденья, пол, потолок, двери, панель и багажник.','service.clean.price':'от 800 000 сум до 100$','service.clean.note':'Итоговая цена зависит от состояния и степени загрязнения автомобиля.',
    'time.1to2':'1–2 часа','time.3to6':'3–6 часов','time.5to8':'5–8 часов','time.byPart':'Зависит от части',
    'price.carDependent':'Цена согласуется в зависимости от автомобиля.','price.negotiable':'Цена — по договорённости.','price.negotiableShort':'По договорённости',
    'part.hood':'Капот','part.bumper':'Передний бампер','part.lights':'Фары','part.mirrors':'Зеркала','part.handles':'Ручки дверей','part.full':'Весь кузов',
    'prices.eyebrow':'ЦЕНА И ВРЕМЯ','prices.title':'Краткий прайс-лист','prices.sunDesc':'Llumar AIR 80 — защита 96–97%','prices.lamDesc':'На месте / со снятием деталей','prices.ppfDesc':'По выбранным частям','prices.cleanDesc':'Подготовка к продаже',
    'guarantee.eyebrow':'СРОК ГАРАНТИИ','guarantee.title':'Гарантия зависит от услуги и материала','guarantee.text':'Точный срок гарантии сообщается до начала работ и зависит от выбранного материала и услуги.','guarantee.tintTitle':'Тонировка и Llumar AIR 80','guarantee.tintText':'Срок гарантии зависит от выбранного типа плёнки.','guarantee.lamTitle':'Ламинация салона','guarantee.lamText':'Условия гарантии зависят от выбранного варианта за 400 000 или 800 000 сум.','guarantee.ppfTitle':'Бронеплёнка','guarantee.ppfText':'Гарантия зависит от материала плёнки и оклеенных частей.','guarantee.cleanTitle':'Химчистка','guarantee.cleanText':'Перед передачей автомобиля салон проверяется вместе с клиентом.',
    'faq.eyebrow':'ЧАСТЫЕ ВОПРОСЫ','faq.title':'Ответы на вопросы','faq.q1':'Сколько времени занимает тонировка?','faq.a1':'Обычно 1–2 часа. Время может зависеть от автомобиля и количества стёкол.','faq.q2':'Какой вид тонировки выбрать?','faq.a2':'В зависимости от бюджета и желаемого уровня защиты можно выбрать Armalan, Americanskiy, Nano Ceramic, Koreyskiy или Dubayskiy.','faq.q3':'Llumar AIR 80 сильно затемняет стекло?','faq.a3':'Нет, стекло не становится сильно тёмным. Основная задача — защита от солнца и тепла до 96–97%.','faq.q4':'В чём разница между ламинацией за 400 и 800 тысяч?','faq.a4':'Вариант за 400 000 сум выполняется на месте. При варианте за 800 000 сум детали снимаются и обрабатываются отдельно.','faq.q5':'Как определяется цена бронеплёнки?','faq.a5':'Цена зависит от выбранных частей, модели автомобиля и материала.',
    'order.eyebrow':'ЗАЯВКА','order.title':'Оставьте заявку','order.text':'Отправьте данные. Администратор увидит заявку и свяжется с вами.','order.phoneHelp':'Можно также оформить заявку по телефону:','order.submit':'Отправить заявку','order.sending':'Отправка...','order.success':'Заявка принята.',
    'form.name':'Ваше имя *','form.namePlaceholder':'Введите имя','form.phone':'Номер телефона *','form.phoneHint':'Например: +998 90 123 45 67','form.brand':'Марка автомобиля *','form.brandPlaceholder':'Например: Chevrolet','form.model':'Модель автомобиля','form.modelPlaceholder':'Например: Cobalt','form.service':'Вид услуги *','form.selectService':'Выберите услугу','form.sunOption':'Защита от солнца — Llumar AIR 80','form.tintType':'Вид тонировки','form.selectType':'Выберите вариант','form.lamType':'Вид ламинации','form.lam400':'400 000 сум — на месте','form.lam800':'800 000 сум — со снятием деталей','form.ppfParts':'Части для бронеплёнки','form.comment':'Дополнительный комментарий','form.commentPlaceholder':'Состояние автомобиля или другая информация',
    'error.name':'Введите корректное имя.','error.phone':'Введите полный номер в формате +998 90 123 45 67.','error.brand':'Введите марку автомобиля.','error.service':'Выберите вид услуги.','error.server':'Не удалось связаться с сервером.',
    'contact.telegram':'Telegram','contact.instagram':'Instagram','contact.eyebrow':'ТОЧНЫЙ АДРЕС И КАРТА','contact.title':'Найдите нас на карте','contact.text':'Позвоните нам или откройте наше местоположение на карте ниже.','contact.phone':'Телефон','contact.address':'Точный адрес','contact.hours':'Время работы','contact.hoursValue':'Ежедневно: 09:00–20:00','contact.openMap':'Открыть на карте',
    'footer.text':'Профессиональные автомобильные услуги.','mobile.call':'Позвонить сейчас','mobile.order':'Заявка','pwa.install':'Установить на телефон','pwa.installed':'Приложение установлено','pwa.eyebrow':'МОБИЛЬНОЕ ПРИЛОЖЕНИЕ','pwa.title':'Добавьте TANIROVKA на экран телефона','pwa.androidHelp':'В меню Chrome выберите «Установить приложение» или «Добавить на главный экран».','pwa.iosHelp':'Нажмите кнопку «Поделиться» в Safari, затем выберите «На экран Домой».','pwa.tryInstall':'Открыть установку','pwa.secureHint':'Для установки сайт должен быть открыт по HTTPS.','aria.menuOpen':'Открыть меню','aria.menuClose':'Закрыть меню'
  },
  en: {
    'promo.badge':'PROMO','promo.text':'Special discount for window tinting + interior cleaning','promo.cta':'Book now',
    'menu.label':'MENU','nav.home':'Home','nav.services':'Services','nav.prices':'Prices','nav.guarantee':'Warranty','nav.faq':'FAQ','nav.order':'Booking','nav.contact':'Location','nav.admin':'Admin','theme.label':'Site color','theme.short':'Color',
    'hero.eyebrow':'AUTOMOTIVE SERVICES','hero.title':'<em>5 essential services</em> for your vehicle','hero.text':'Window tinting, sun protection, interior lamination, paint protection film and interior cleaning. We agree on the final price based on the vehicle condition and offer a convenient rate.','hero.trust1':'Quality materials','hero.trust2':'Fast service','hero.trust3':'Agreed price','hero.servicesCta':'View services','hero.orderCta':'Book a service',
    'summary.tint':'01 — Window tinting','summary.sun':'02 — Sun protection','summary.lam':'03 — Interior lamination','summary.ppf':'04 — Protection film','summary.clean':'05 — Interior cleaning',
    'services.eyebrow':'CORE SERVICES','services.title':'Our services','services.text':'Clear and easy-to-understand information about every service.',
    'service.tint.name':'Window tinting','service.tint.text':'We professionally install window tint film. The price depends on the vehicle and the selected film.','service.tint.types':'Tint film types:',
    'service.sun.name':'Sun protection','service.sun.text':'Llumar AIR 80 provides approximately <strong>96–97%</strong> protection from sunlight and heat without making the glass excessively dark.',
    'service.lam.name':'Interior lamination','service.lam.400':'Completed in place without removing interior parts.','service.lam.800':'Interior parts are removed and treated separately.',
    'service.ppf.name':'Protection film','service.ppf.text':'The price depends on which vehicle parts will be covered. We offer a convenient and affordable price.',
    'service.clean.name':'Interior cleaning','service.clean.text':'We deep-clean the interior and prepare the vehicle for sale. Seats, floor, ceiling, door panels, dashboard and trunk are cleaned.','service.clean.price':'from 800,000 UZS to $100','service.clean.note':'The final price depends on the vehicle condition and level of dirt.',
    'time.1to2':'1–2 hours','time.3to6':'3–6 hours','time.5to8':'5–8 hours','time.byPart':'Depends on area',
    'price.carDependent':'Price is agreed based on the vehicle.','price.negotiable':'Price — by agreement.','price.negotiableShort':'By agreement',
    'part.hood':'Hood','part.bumper':'Front bumper','part.lights':'Headlights','part.mirrors':'Mirrors','part.handles':'Door handles','part.full':'Full body',
    'prices.eyebrow':'PRICE AND TIME','prices.title':'Quick price list','prices.sunDesc':'Llumar AIR 80 — 96–97% protection','prices.lamDesc':'In place / parts removed','prices.ppfDesc':'Based on selected areas','prices.cleanDesc':'Prepared for sale',
    'guarantee.eyebrow':'WARRANTY PERIOD','guarantee.title':'Warranty depends on the service and material','guarantee.text':'The exact warranty period is confirmed before work begins based on the selected material and service.','guarantee.tintTitle':'Window tinting and Llumar AIR 80','guarantee.tintText':'The warranty period depends on the selected film type.','guarantee.lamTitle':'Interior lamination','guarantee.lamText':'Warranty terms depend on the selected 400,000 or 800,000 UZS service option.','guarantee.ppfTitle':'Protection film','guarantee.ppfText':'Warranty depends on the film material and covered areas.','guarantee.cleanTitle':'Interior cleaning','guarantee.cleanText':'The interior is inspected together with the customer before handover.',
    'faq.eyebrow':'FREQUENTLY ASKED QUESTIONS','faq.title':'Questions and answers','faq.q1':'How long does window tinting take?','faq.a1':'Usually 1–2 hours. It may vary depending on the vehicle and number of windows.','faq.q2':'Which tint film should I choose?','faq.a2':'Depending on your budget and desired protection level, you can choose Armalan, Americanskiy, Nano Ceramic, Koreyskiy or Dubayskiy.','faq.q3':'Does Llumar AIR 80 make the glass dark?','faq.a3':'It does not make the glass excessively dark. Its main purpose is to provide up to 96–97% protection from sunlight and heat.','faq.q4':'What is the difference between the 400,000 and 800,000 options?','faq.a4':'The 400,000 UZS option is completed in place. With the 800,000 UZS option, parts are removed and treated separately.','faq.q5':'How is the protection film price calculated?','faq.a5':'The price depends on the covered areas, vehicle type and selected material.',
    'order.eyebrow':'BOOKING','order.title':'Book a service','order.text':'Send your details. The administrator will review your request and contact you.','order.phoneHelp':'You can also book by phone:','order.submit':'Send booking','order.sending':'Sending...','order.success':'Your booking has been accepted.',
    'form.name':'Your name *','form.namePlaceholder':'Enter your name','form.phone':'Phone number *','form.phoneHint':'Example: +998 90 123 45 67','form.brand':'Vehicle brand *','form.brandPlaceholder':'Example: Chevrolet','form.model':'Vehicle model','form.modelPlaceholder':'Example: Cobalt','form.service':'Service type *','form.selectService':'Select a service','form.sunOption':'Sun protection — Llumar AIR 80','form.tintType':'Tint film type','form.selectType':'Select an option','form.lamType':'Lamination type','form.lam400':'400,000 UZS — completed in place','form.lam800':'800,000 UZS — parts removed','form.ppfParts':'Areas for protection film','form.comment':'Additional comment','form.commentPlaceholder':'Vehicle condition or other information',
    'error.name':'Please enter a valid name.','error.phone':'Enter the full phone number in +998 90 123 45 67 format.','error.brand':'Enter the vehicle brand.','error.service':'Select a service type.','error.server':'Could not connect to the server.',
    'contact.telegram':'Telegram','contact.instagram':'Instagram','contact.eyebrow':'EXACT LOCATION AND MAP','contact.title':'Find us on the map','contact.text':'Call us or open our location using the map below.','contact.phone':'Phone','contact.address':'Exact location','contact.hours':'Working hours','contact.hoursValue':'Every day: 09:00–20:00','contact.openMap':'Open in Maps',
    'footer.text':'Professional automotive services.','mobile.call':'Call now','mobile.order':'Booking','pwa.install':'Install on phone','pwa.installed':'App installed','pwa.eyebrow':'MOBILE APP','pwa.title':'Add TANIROVKA to your phone','pwa.androidHelp':'Open the Chrome menu and choose “Install app” or “Add to Home screen”.','pwa.iosHelp':'Tap Share in Safari, then choose “Add to Home Screen”.','pwa.tryInstall':'Open installation','pwa.secureHint':'The site must be opened over HTTPS to install.','aria.menuOpen':'Open menu','aria.menuClose':'Close menu'
  }
};

let currentLang = localStorage.getItem('tanirovka-lang');
if (!TRANSLATIONS[currentLang]) currentLang = 'uz';

function tr(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.uz[key] ?? key;
}

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('tanirovka-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = tr(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = tr(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = tr(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('.lang-btn').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) menuBtn.setAttribute('aria-label', menuBtn.getAttribute('aria-expanded') === 'true' ? tr('aria.menuClose') : tr('aria.menuOpen'));

  document.querySelectorAll('.accordion__item.open').forEach((item) => {
    const content = item.querySelector('.accordion__content');
    content.style.maxHeight = `${content.scrollHeight}px`;
  });

  requestAnimationFrame(() => refreshCustomSelects());
}

document.querySelectorAll('.lang-btn').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navDrawer = document.getElementById('navDrawer');
const navBackdrop = document.getElementById('navBackdrop');
const drawerClose = document.getElementById('drawerClose');
const paletteBtn = document.getElementById('paletteBtn');
const palettePopover = document.getElementById('palettePopover');

const permanentMenuMedia = window.matchMedia('(min-width: 1180px)');

function syncPermanentMenu() {
  if (permanentMenuMedia.matches) {
    navDrawer.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.remove('open');
    navBackdrop.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    drawerClose.setAttribute('tabindex', '-1');
  } else {
    drawerClose.removeAttribute('tabindex');
    navDrawer.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('open');
    navBackdrop.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
}

function setMenuState(open) {
  if (permanentMenuMedia.matches) {
    syncPermanentMenu();
    return;
  }
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? tr('aria.menuClose') : tr('aria.menuOpen'));
  navDrawer.classList.toggle('open', open);
  navDrawer.setAttribute('aria-hidden', String(!open));
  navBackdrop.classList.toggle('open', open);
  navBackdrop.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
  if (open) setTimeout(() => navDrawer.querySelector('a')?.focus({ preventScroll: true }), 180);
}

function closeMenu() { setMenuState(false); }
menuBtn.addEventListener('click', () => setMenuState(menuBtn.getAttribute('aria-expanded') !== 'true'));
drawerClose.addEventListener('click', closeMenu);
navBackdrop.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (!permanentMenuMedia.matches) closeMenu();
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!permanentMenuMedia.matches) closeMenu();
    closePalette();
  }
});

permanentMenuMedia.addEventListener?.('change', syncPermanentMenu);
syncPermanentMenu();

function closePalette() {
  palettePopover.classList.remove('open');
  palettePopover.setAttribute('aria-hidden', 'true');
  paletteBtn?.setAttribute('aria-expanded', 'false');
}

paletteBtn?.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = !palettePopover.classList.contains('open');
  palettePopover.classList.toggle('open', open);
  palettePopover.setAttribute('aria-hidden', String(!open));
  paletteBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => {
  if (!palettePopover.contains(event.target) && event.target !== paletteBtn) closePalette();
});

const allowedThemes = ['gold', 'blue', 'green', 'red', 'violet'];
function applyTheme(theme) {
  const next = allowedThemes.includes(theme) ? theme : 'gold';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('tanirovka-theme', next);
  document.querySelectorAll('.theme-dot').forEach((button) => {
    const active = button.dataset.theme === next;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
document.querySelectorAll('.theme-dot').forEach((button) => button.addEventListener('click', () => {
  applyTheme(button.dataset.theme);
  closePalette();
}));
applyTheme(localStorage.getItem('tanirovka-theme') || 'gold');

const trackedSections = [...nav.querySelectorAll('a[href^="#"]')]
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

function setActiveNavSection(activeSection) {
  trackedSections.forEach(({ link, section }) => {
    const isActive = section === activeSection;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function updateActiveNavSection() {
  if (!trackedSections.length) return;
  const scrollTop = window.scrollY || window.pageYOffset || 0;
  const doc = document.documentElement;
  const scrollBottom = scrollTop + window.innerHeight;
  const pageBottom = Math.max(doc.scrollHeight, document.body.scrollHeight || 0);
  const marker = scrollTop + Math.min(window.innerHeight * 0.34, 260);

  let activeSection = trackedSections[0].section;
  for (const item of trackedSections) {
    if (item.section.offsetTop - 120 <= marker) activeSection = item.section;
  }

  if (scrollBottom >= pageBottom - 8) {
    activeSection = trackedSections[trackedSections.length - 1].section;
  }

  setActiveNavSection(activeSection);
}

let navScrollTick = false;
function requestNavSectionUpdate() {
  if (navScrollTick) return;
  navScrollTick = true;
  requestAnimationFrame(() => {
    navScrollTick = false;
    updateActiveNavSection();
  });
}

trackedSections.forEach(({ link, section }) => {
  link.addEventListener('click', () => setActiveNavSection(section));
});
window.addEventListener('scroll', requestNavSectionUpdate, { passive: true });
window.addEventListener('resize', requestNavSectionUpdate);
window.addEventListener('load', requestNavSectionUpdate);
requestNavSectionUpdate();


/* ============ CUSTOM RANGLI SELECTLAR ============ */
const customSelectInstances = new Map();

function closeCustomSelects(except = null) {
  customSelectInstances.forEach((instance) => {
    if (instance === except) return;
    instance.wrapper.classList.remove('is-open');
    instance.trigger.setAttribute('aria-expanded', 'false');
  });
}

function buildCustomSelectOptions(instance) {
  const { select, menu } = instance;
  menu.innerHTML = '';

  [...select.options].forEach((option, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'custom-select__option';
    item.dataset.value = option.value;
    item.dataset.index = String(index);
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(option.selected));
    item.disabled = option.disabled;
    item.innerHTML = `<span>${option.textContent}</span><i aria-hidden="true">✓</i>`;

    if (!option.value) item.classList.add('is-placeholder');
    if (option.selected) item.classList.add('is-selected');

    item.addEventListener('click', () => {
      if (option.disabled) return;
      select.value = option.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      syncCustomSelect(instance);
      closeCustomSelects();
      instance.trigger.focus({ preventScroll: true });
    });

    menu.appendChild(item);
  });
}

function syncCustomSelect(instance) {
  const { select, trigger, valueText, wrapper, menu } = instance;
  const selected = select.options[select.selectedIndex] || select.options[0];
  valueText.textContent = selected?.textContent || '';
  wrapper.classList.toggle('has-value', Boolean(select.value));
  wrapper.classList.toggle('is-disabled', select.disabled);
  trigger.disabled = select.disabled;

  [...menu.querySelectorAll('.custom-select__option')].forEach((item) => {
    const active = item.dataset.value === select.value && Number(item.dataset.index) === select.selectedIndex;
    item.classList.toggle('is-selected', active);
    item.setAttribute('aria-selected', String(active));
  });
}

function refreshCustomSelects() {
  customSelectInstances.forEach((instance) => {
    buildCustomSelectOptions(instance);
    syncCustomSelect(instance);
  });
}

function initCustomSelects(root = document) {
  root.querySelectorAll('.field select:not([data-custom-select-ready])').forEach((select) => {
    select.dataset.customSelectReady = 'true';
    select.classList.add('native-select-hidden');
    select.hidden = true;
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const valueText = document.createElement('span');
    valueText.className = 'custom-select__value';

    const arrow = document.createElement('span');
    arrow.className = 'custom-select__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '<i></i>';

    const menu = document.createElement('div');
    menu.className = 'custom-select__menu';
    menu.setAttribute('role', 'listbox');
    menu.tabIndex = -1;

    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, trigger, menu);
    trigger.append(valueText, arrow);

    const instance = { select, wrapper, trigger, valueText, menu };
    customSelectInstances.set(select, instance);

    buildCustomSelectOptions(instance);
    syncCustomSelect(instance);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const opening = !wrapper.classList.contains('is-open');
      closeCustomSelects(instance);
      wrapper.classList.toggle('is-open', opening);
      trigger.setAttribute('aria-expanded', String(opening));
      if (opening) {
        const rect = trigger.getBoundingClientRect();
        const menuHeight = Math.min(menu.scrollHeight || 300, window.innerHeight * .46);
        const spaceBelow = window.innerHeight - rect.bottom;
        wrapper.classList.toggle('opens-up', spaceBelow < menuHeight + 18 && rect.top > spaceBelow);
        const selectedItem = menu.querySelector('.is-selected:not(.is-placeholder)') || menu.querySelector('.custom-select__option');
        selectedItem?.scrollIntoView({ block: 'nearest' });
      } else {
        wrapper.classList.remove('opens-up');
      }
    });

    trigger.addEventListener('keydown', (event) => {
      const items = [...menu.querySelectorAll('.custom-select__option:not(:disabled)')];
      const currentIndex = Math.max(0, items.findIndex((item) => item.classList.contains('is-selected')));
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!wrapper.classList.contains('is-open')) {
          wrapper.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          return;
        }
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const next = items[(currentIndex + direction + items.length) % items.length];
        next?.focus();
      }
    });

    select.addEventListener('change', () => syncCustomSelect(instance));

    const observer = new MutationObserver(() => {
      buildCustomSelectOptions(instance);
      syncCustomSelect(instance);
    });
    observer.observe(select, { childList: true, subtree: true, characterData: true, attributes: true });
  });
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.custom-select')) closeCustomSelects();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCustomSelects();
});

initCustomSelects();

applyLanguage(currentLang);

document.querySelectorAll('[data-phone-link]').forEach((link) => { link.href = `tel:${CONFIG.phoneHref}`; });
document.querySelectorAll('[data-phone-text]').forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
document.getElementById('year').textContent = new Date().getFullYear();

const orderPhone = document.getElementById('orderPhone');
function formatUzbekPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  let formatted = '+998 ';
  if (digits.length > 0) formatted += digits.slice(0, 2);
  if (digits.length > 2) formatted += ` ${digits.slice(2, 5)}`;
  if (digits.length > 5) formatted += ` ${digits.slice(5, 7)}`;
  if (digits.length > 7) formatted += ` ${digits.slice(7, 9)}`;
  return formatted;
}
function placePhoneCursorAtEnd() {
  const end = orderPhone.value.length;
  orderPhone.setSelectionRange(end, end);
}
orderPhone.value = formatUzbekPhone(orderPhone.value);
orderPhone.addEventListener('focus', () => {
  if (!orderPhone.value.startsWith('+998')) orderPhone.value = '+998 ';
  requestAnimationFrame(placePhoneCursorAtEnd);
});
orderPhone.addEventListener('input', () => {
  orderPhone.value = formatUzbekPhone(orderPhone.value);
  placePhoneCursorAtEnd();
});
orderPhone.addEventListener('keydown', (event) => {
  const cursor = orderPhone.selectionStart ?? orderPhone.value.length;
  const noSelection = orderPhone.selectionStart === orderPhone.selectionEnd;
  if ((event.key === 'Backspace' || event.key === 'Delete') && cursor <= 5 && noSelection) event.preventDefault();
});

const accordionButtons = document.querySelectorAll('.accordion__button');
accordionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.accordion__item');
    const content = item.querySelector('.accordion__content');
    const opening = !item.classList.contains('open');
    document.querySelectorAll('.accordion__item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion__content').style.maxHeight = '0px';
    });
    if (opening) {
      item.classList.add('open');
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

const orderService = document.getElementById('orderService');
const tintOptions = document.getElementById('tintOptions');
const lamOptions = document.getElementById('lamOptions');
const ppfOptions = document.getElementById('ppfOptions');
function updateServiceOptions() {
  const service = orderService.value;
  tintOptions.hidden = service !== 'tint';
  lamOptions.hidden = service !== 'lam';
  ppfOptions.hidden = service !== 'ppf';
}
orderService.addEventListener('change', updateServiceOptions);
updateServiceOptions();


function showOrderMessage(message, type) {
  const box = document.getElementById('orderMessage');
  box.textContent = message;
  box.className = `form-status show ${type}`;
}

const orderForm = document.getElementById('orderForm');
orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = document.getElementById('orderSubmit');
  const ppfParts = [...document.querySelectorAll('#ppfOptions input:checked')].map((input) => input.value);
  const payload = {
    name: document.getElementById('orderName').value.trim(),
    phone: orderPhone.value.trim(),
    brand: document.getElementById('orderBrand').value.trim(),
    model: document.getElementById('orderModel').value.trim(),
    service: orderService.value,
    tintType: document.getElementById('orderTintType').value,
    serviceOption: document.getElementById('orderServiceOption').value,
    ppfParts,
    comment: document.getElementById('orderComment').value.trim()
  };

  if (payload.name.length < 2) return showOrderMessage(tr('error.name'), 'error');
  if (!/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(payload.phone)) return showOrderMessage(tr('error.phone'), 'error');
  if (!payload.brand) return showOrderMessage(tr('error.brand'), 'error');
  if (!payload.service) return showOrderMessage(tr('error.service'), 'error');

  submit.disabled = true;
  submit.textContent = tr('order.sending');
  try {
    const response = await fetch(apiUrl('/api/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || tr('error.server'));
    showOrderMessage(tr('order.success'), 'success');
    orderForm.reset();
    orderPhone.value = '+998 ';
    updateServiceOptions();
    refreshCustomSelects();
  } catch (error) {
    showOrderMessage(error.message || tr('error.server'), 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = tr('order.submit');
  }
});


// Hero summary animated jump to order
const orderSection = document.getElementById("order");
const serviceSelect = document.getElementById("orderService");
document.querySelectorAll("[data-order-jump]").forEach((item) => {
  item.addEventListener("click", () => {
    const serviceKey = item.getAttribute("data-order-jump");
    item.classList.remove("is-bouncing");
    void item.offsetWidth;
    item.classList.add("is-bouncing");

    if (serviceSelect) {
      const valueMap = { tint: "tint", sun: "sun", lam: "lam", ppf: "ppf", clean: "clean" };
      serviceSelect.value = valueMap[serviceKey] || "";
      serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const card = orderSection.querySelector('.order-card, .order-form, .order-box, .order-grid, form');
        const target = card || orderSection;
        target.classList.remove('order-highlight');
        void target.offsetWidth;
        target.classList.add('order-highlight');
      }, 550);
    }
  });
});


/* ============ PWA / TELEFONGA O‘RNATISH ============ */
let deferredInstallPrompt = null;
const installAppBtn = document.getElementById('installAppBtn');
const pwaModal = document.getElementById('pwaModal');
const pwaModalText = document.getElementById('pwaModalText');
const pwaModalAction = document.getElementById('pwaModalAction');

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function setInstallButtonState() {
  if (!installAppBtn) return;
  if (isStandaloneMode()) {
    installAppBtn.classList.add('is-installed');
    installAppBtn.disabled = true;
    const label = installAppBtn.querySelector('[data-i18n]');
    if (label) label.textContent = tr('pwa.installed');
  }
}

function openPwaModal(messageKey) {
  if (!pwaModal) return;
  if (pwaModalText) pwaModalText.textContent = tr(messageKey || (isIosDevice() ? 'pwa.iosHelp' : 'pwa.androidHelp'));
  pwaModal.classList.add('open');
  pwaModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('pwa-modal-open');
}

function closePwaModal() {
  if (!pwaModal) return;
  pwaModal.classList.remove('open');
  pwaModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pwa-modal-open');
}

async function requestPwaInstall() {
  if (isStandaloneMode()) return;
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch (error) { /* user closed prompt */ }
    deferredInstallPrompt = null;
    closePwaModal();
    return;
  }
  openPwaModal(isIosDevice() ? 'pwa.iosHelp' : 'pwa.androidHelp');
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppBtn) installAppBtn.classList.add('is-ready');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  closePwaModal();
  setInstallButtonState();
});

if (installAppBtn) installAppBtn.addEventListener('click', requestPwaInstall);
if (pwaModalAction) pwaModalAction.addEventListener('click', requestPwaInstall);
document.querySelectorAll('[data-pwa-close]').forEach((button) => button.addEventListener('click', closePwaModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePwaModal(); });

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => console.warn('Service worker o‘rnatilmadi:', error));
  });
}

setInstallButtonState();


// ============ FINAL PRO REVEAL ============
document.documentElement.classList.add('js');
const revealTargets = document.querySelectorAll('.section-head, .service, .price-row, .guarantee-cards article, .accordion__item, .contact-card, .map-wrap, .order-form, .order-help, .order-contact-list');
revealTargets.forEach((el, index) => {
  el.classList.add('pro-reveal');
  el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 60}ms`);
});
if ('IntersectionObserver' in window) {
  const proRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -45px 0px' });
  revealTargets.forEach((el) => proRevealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

document.querySelectorAll('[data-order-jump]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-order-jump]').forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
  });
});
