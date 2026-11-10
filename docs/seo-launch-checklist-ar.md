# قائمة خطوات الـ SEO وإطلاق نقي الرابية على جوجل (بالعربي)

آخر تحديث: بعد تغيير أسماء المنتجات إلى صيغة «النوع + نقي» وإضافة رزن M445.
هذه القائمة **إجراءات تحتاج حساباتك أنت** (جوجل، DNS، Vercel). الكود نفسه جاهز:
sitemap وrobots وcanonical وhreflang وSchema وصفحات التصنيف والأدلة كلها موجودة.

## الحالة الآن
| البند | الحالة |
|---|---|
| sitemap.xml (94 رابطاً، دومين www فقط) | جاهز |
| robots.txt (يحجب /admin و/api فقط) | جاهز |
| canonical وhreflang (ar/en/x-default) | جاهز |
| Schema: Organization وLocalBusiness وWebSite وProduct وService وArticle وFAQPage وBreadcrumb | جاهز |
| H1 واحد وTitle وMeta لكل صفحة | جاهز (الرئيسية والمنتجات والأدلة حُسّنت في هذه الجولة) |
| توثيق Search Console (`GOOGLE_SITE_VERIFICATION`) | **غير مفعّل بعد: خطوة منك** |
| ملف Google Business Profile | **خطوة منك** |
| روابط السوشيال (sameAs) | **فارغة: تحتاج الروابط الرسمية** |
| أسعار المنتجات (offers بالـ Schema) | تنتظر الأسعار المؤكدة |

## أولاً: Google Search Console (الأهم)
1. ادخل search.google.com/search-console بحساب الشركة، واضغط Add property.
2. اختر **Domain** واكتب `naqijo.com` (يغطي naqijo.com وwww وhttp وhttps).
3. انسخ سجل TXT الذي يعرضه جوجل وأضفه عند مزوّد الـ DNS للدومين، ثم اضغط Verify (قد يتأخر دقائق إلى ساعات).
   - إذا ما عندك وصول للـ DNS: اختر **URL prefix** بالعنوان `https://www.naqijo.com`، وخذ رمز الـ meta، وضعه في Vercel → Settings → Environment Variables باسم `GOOGLE_SITE_VERIFICATION` (الرمز فقط، بدون وسم HTML)، ثم Redeploy، ثم Verify.
4. من Indexing → Sitemaps أضف: `https://www.naqijo.com/sitemap.xml` واضغط Submit. المتوقع: Success وحوالي 94 رابطاً مكتشفاً.
5. من شريط URL Inspection افحص الصفحات التالية واضغط **Request indexing** (فقط هذه، لا تطلب فهرسة كل الصفحات):
   - `https://www.naqijo.com/ar` و`/en`
   - `/ar/products` و`/en/products`
   - `/ar/products/naqi-m445-softening-resin` و`/en/products/naqi-m445-softening-resin`
   - `/ar/products/category/water-softening`
   - `/ar/water-filters-amman` و`/en/water-filters-amman`
   - `/ar/guides/hard-water-and-water-softeners`
   - 3 منتجات مُعاد تسميتها: `ro-system-7stage` و`digital-filter-8s` و`softener`
   لكل صفحة: Test Live URL ← تأكد أنها متاحة وبدون noindex، وأن الـ canonical الذي تعلنه الصفحة هو نفسه الذي يختاره جوجل.
6. بعد 3–7 أيام راجع Indexing → Pages. «Discovered / Crawled – currently not indexed» طبيعي للصفحات الجديدة، ولا تكرر طلب الفهرسة.
7. تحقق من Enhancements: Products وBreadcrumbs وFAQ، وأي تحذير يصلني لأصلحه.

## ثانياً: Bing وبقية المحركات
1. Bing Webmaster Tools (bing.com/webmasters): Import من Google Search Console، وهو أسرع من التوثيق اليدوي.
2. إن أردت التوثيق بالـ meta: ضع `BING_SITE_VERIFICATION` في Vercel وأعد النشر.
3. أرسل نفس الـ sitemap.
4. Bing يغذّي ChatGPT وDuckDuckGo وغيرها، فهذه الخطوة مهمة للظهور بنتائج الذكاء الاصطناعي أيضاً.

## ثالثاً: Google Business Profile (الأقوى للبحث المحلي بعمّان)
اتبع `docs/google-business-profile.md`. الخلاصة:
1. أنشئ/اطلب ملكية الملف باسم «نقي الرابية» بنفس العنوان والهاتف المكتوبين بالموقع (NAP).
2. التصنيف الرئيسي المقترح: Water treatment supplier، والثانوية من القائمة.
3. أضف ساعات العمل **الفعلية** (الموقع يقول «7 أيام» فقط) والصور الحقيقية.
4. بعد التوثيق انسخ: رابط الخريطة، وPlace ID، ورابط التقييم، وضعها في Vercel:
   `NEXT_PUBLIC_GOOGLE_MAPS_URL` و`NEXT_PUBLIC_GOOGLE_PLACE_ID` (والموقع يضيف زر الخريطة وhasMap تلقائياً).
5. اطلب تقييمات حقيقية من العملاء (انظر `docs/google-reviews-playbook.md`). لا تشترِ ولا تؤلّف تقييمات.

## رابعاً: ما أحتاجه منك حتى أكمل في الكود
- **روابط السوشيال الرسمية** (فيسبوك وانستغرام ويوتيوب ولينكدإن) لأضيفها إلى `siteConfig.social` فتظهر كـ sameAs بالـ Schema.
- **الأسعار المؤكدة** (دينار، ثابت أم ابتداءً من، شامل التركيب؟) لأضيف `offers` بالـ Schema وعرض السعر بالصفحة. لن أضع سعراً غير مؤكد.
- **قرار العلامة بالـ Schema:** `brand` و`manufacturer` ما زالا كما هما بانتظار تحققك من علامة NAQI / NAQI International.
- **أكواد الموديلات** بعد متابعة فريقك.
- **Technical Data Sheet** رسمي لرزن M445 (لإضافة مواصفات مثل المصفوفة وحجم الرطوبة والتجديد).

## خامساً: محتوى وروابط خارجية (يرفع الترتيب فعلاً)
1. **صفحات المنتجات:** أضف محتوى لكل منتج (فيديو قصير، صور حقيقية للتركيب، أسئلة شائعة). الصفحات الحالية قصيرة نسبياً.
2. **صفحات المشاريع** (4 صفحات) قصيرة جداً (~200 كلمة): أضف تفاصيل حقيقية وصوراً.
3. **الأدلة:** 6 أدلة موجودة؛ أضف دليلاً كل شهر لأسئلة يبحث عنها الناس (مثل: كم يستهلك فلتر RO؟ أفضل وقت لتغيير الشمعات).
4. **الدلائل المحلية والـ citations:** `docs/local-citations-roadmap.md` (Bing Places وApple Business Connect ودلائل الأردن).
5. **روابط خارجية:** `docs/offsite-authority-roadmap.md`. اطلب روابط من الشركاء والمشاريع المنفّذة، وتجنب شراء الروابط.

## سادساً: المتابعة الأسبوعية (15 دقيقة)
1. Indexing → Pages: أخطاء جديدة؟
2. Sitemaps: الحالة وعدد الروابط.
3. Performance: ظهور وكليكات الاستعلامات التالية:
   - علامة: «نقي الرابية» وNaqiJo
   - منتجات: «فلتر مياه نقي» و«كولر مياه نقي» و«سوفتنر نقي» و«رزن سوفتنر»
   - محلي: «فلاتر مياه عمان» و«سوفتنر عمان» و«فلتر RO الأردن»
4. تأكد من عدم وجود Manual actions أو Security issues.
5. شهرياً: Core Web Vitals (بيانات المستخدمين الفعلية)، وتوافق الاسم/العنوان/الهاتف مع GBP.

> لا أحد يضمن ترتيباً محدداً. المتوقع بعد الفهرسة ظهور تدريجي خلال أسابيع إلى أشهر حسب المنافسة والمحتوى والروابط.
