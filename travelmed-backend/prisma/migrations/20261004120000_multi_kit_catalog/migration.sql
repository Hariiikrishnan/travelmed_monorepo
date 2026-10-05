-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "consultsAllowed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "bagSize" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bagWeight" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "consultsIncluded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitTypeId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tagline" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tripLength" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "medicine_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_items" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "note" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kit_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medicine_categories_slug_key" ON "medicine_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_categories_name_key" ON "medicine_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "kit_types_slug_key" ON "kit_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kit_types_name_key" ON "kit_types"("name");

-- CreateIndex
CREATE INDEX "kit_items_medicineId_idx" ON "kit_items"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "kit_items_productId_medicineId_key" ON "kit_items"("productId", "medicineId");

-- CreateIndex
CREATE INDEX "medicines_categoryId_idx" ON "medicines"("categoryId");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "medicine_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_kitTypeId_fkey" FOREIGN KEY ("kitTypeId") REFERENCES "kit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ── Data backfill ─────────────────────────────────────────────────────────────

-- Medicine categories: the 17 curated kit categories (icon '' = website uses its built-in icon)
INSERT INTO "medicine_categories" ("id", "slug", "name", "icon", "sortOrder", "updatedAt") VALUES
  ('cat-antacids',          'antacids',          'Antacids',                  '/icons/Antacids.webp',                1,  CURRENT_TIMESTAMP),
  ('cat-pain-killers',      'pain-killers',      'Pain Killers & Analgesics', '',                                    2,  CURRENT_TIMESTAMP),
  ('cat-antimotility',      'antimotility',      'Antimotility Drugs',        '/icons/Antimotility Drugs.webp',      3,  CURRENT_TIMESTAMP),
  ('cat-laxative',          'laxative',          'Laxative Stimulant',        '',                                    4,  CURRENT_TIMESTAMP),
  ('cat-antispasmodics',    'antispasmodics',    'Antispasmodics',            '',                                    5,  CURRENT_TIMESTAMP),
  ('cat-cough',             'cough-suppressant', 'Cough Suppressant',         '/icons/cough.webp',                   6,  CURRENT_TIMESTAMP),
  ('cat-antibiotic',        'antibiotic',        'Antibiotic',                '/icons/antibiotic.webp',              7,  CURRENT_TIMESTAMP),
  ('cat-ors',               'ors-salts',         'ORS Salts',                 '',                                    8,  CURRENT_TIMESTAMP),
  ('cat-antihistamine',     'antihistamine',     'Antihistamine',             '/icons/antihistamines.webp',          9,  CURRENT_TIMESTAMP),
  ('cat-motion-sickness',   'motion-sickness',   'Motion Sickness Tablets',   '/icons/Motion Sickness Tablets.webp', 10, CURRENT_TIMESTAMP),
  ('cat-antiemetic',        'antiemetic',        'Antiemetic',                '',                                    11, CURRENT_TIMESTAMP),
  ('cat-antipyretic',       'antipyretic',       'Antipyretic (Fever)',       '/icons/Antipyretic.svg',              12, CURRENT_TIMESTAMP),
  ('cat-anti-cold',         'anti-cold',         'Anti Cold',                 '/icons/Anticold.webp',                13, CURRENT_TIMESTAMP),
  ('cat-sore-throat',       'sore-throat',       'Sore Throat Lozenges',      '/icons/sore-throat.webp',             14, CURRENT_TIMESTAMP),
  ('cat-probiotics',        'probiotics',        'Pre & Probiotics',          '/icons/probiotics.webp',              15, CURRENT_TIMESTAMP),
  ('cat-bandages',          'bandages',          'Bandages & Plasters',       '/icons/bandage.webp',                 16, CURRENT_TIMESTAMP),
  ('cat-first-aid',         'first-aid',         'First Aid Essentials',      '/icons/bandage.webp',                 17, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Map the existing medicines onto the curated categories
UPDATE "medicines" m SET "categoryId" = c.id, "category" = c.name
FROM (VALUES
  ('med-digene', 'cat-antacids'),
  ('med-aceclofenac', 'cat-pain-killers'), ('med-combiflam', 'cat-pain-killers'),
  ('med-diclofenac', 'cat-pain-killers'), ('med-ibuprofen', 'cat-pain-killers'),
  ('med-loperamide', 'cat-antimotility'),
  ('med-amoxicillin', 'cat-antibiotic'), ('med-antibiotic-ointment', 'cat-antibiotic'),
  ('med-ors', 'cat-ors'),
  ('med-cetirizine', 'cat-antihistamine'), ('med-diphenhydramine', 'cat-antihistamine'),
  ('med-avomine', 'cat-motion-sickness'),
  ('med-paracetamol', 'cat-antipyretic'),
  ('med-decongestant', 'cat-anti-cold'),
  ('med-bandaid', 'cat-bandages'),
  ('med-thermometer', 'cat-first-aid')
) AS map(med_id, cat_id)
JOIN "medicine_categories" c ON c.id = map.cat_id
WHERE m.id = map.med_id;

-- Any other medicine: attach by matching its old category name, else leave for the admin
UPDATE "medicines" m SET "categoryId" = c.id
FROM "medicine_categories" c
WHERE m."categoryId" IS NULL AND lower(m."category") = lower(c.name);

-- Kit types
INSERT INTO "kit_types" ("id", "slug", "name", "description", "sortOrder", "updatedAt") VALUES
  ('kt-long-stay',  'long-stay-abroad', 'Long-Stay Abroad', 'For travellers staying abroad for several weeks or months.', 1, CURRENT_TIMESTAMP),
  ('kt-short-trip', 'short-trip',       'Short Trip',       'For holidays and business trips of a few days to two weeks.', 2, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- The existing kit becomes the featured Long-Stay kit with 2 consults
UPDATE "products" SET
  "kitTypeId" = 'kt-long-stay',
  "consultsIncluded" = 2,
  "isFeatured" = true,
  "sortOrder" = 1,
  "tagline" = CASE WHEN "tagline" = '' THEN 'Complete medical cover for long stays abroad' ELSE "tagline" END,
  "tripLength" = CASE WHEN "tripLength" = '' THEN 'Long stays abroad (15+ days)' ELSE "tripLength" END,
  "bagSize" = CASE WHEN "bagSize" = '' THEN COALESCE("specs"->>'Dimensions', '') ELSE "bagSize" END
WHERE "id" = 'kit-standard-india';

-- Starting contents for that kit: every current medicine × 1 (the admin adjusts quantities)
INSERT INTO "kit_items" ("id", "productId", "medicineId", "quantity", "unit", "sortOrder")
SELECT 'ki-' || md5('kit-standard-india' || m.id), 'kit-standard-india', m.id, 1, 'pack', 0
FROM "medicines" m
WHERE EXISTS (SELECT 1 FROM "products" p WHERE p.id = 'kit-standard-india')
ON CONFLICT DO NOTHING;

-- Every order placed so far was sold with 2 free consultations
UPDATE "orders" SET "consultsAllowed" = 2;
