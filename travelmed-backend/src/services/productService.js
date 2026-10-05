import prisma from '../config/database.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

const include = {
  kitType: { select: { id: true, slug: true, name: true } },
  items: {
    orderBy: [{ sortOrder: 'asc' }, { medicine: { name: 'asc' } }],
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          activeIngredient: true,
          medicineCategory: { select: { id: true, slug: true, name: true, icon: true, sortOrder: true } },
        },
      },
    },
  },
};

const orderBy = [{ sortOrder: 'asc' }, { createdAt: 'asc' }];

/** Flattens kit contents and adds the derived counts the website and admin display. */
const shape = (product) => {
  const items = product.items.map((i) => ({
    medicineId: i.medicineId,
    name: i.medicine.name,
    activeIngredient: i.medicine.activeIngredient,
    quantity: i.quantity,
    unit: i.unit,
    note: i.note,
    category: i.medicine.medicineCategory,
  }));

  const byCategory = new Map();
  for (const item of items) {
    if (!item.category) continue;
    const entry = byCategory.get(item.category.id) ?? { ...item.category, medicines: 0 };
    entry.medicines += 1;
    byCategory.set(item.category.id, entry);
  }
  const categories = [...byCategory.values()]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map(({ sortOrder, ...c }) => c); // eslint-disable-line no-unused-vars

  return {
    ...product,
    items,
    categories,
    counts: {
      medicines: items.length,
      units: items.reduce((sum, i) => sum + i.quantity, 0),
      categories: categories.length,
    },
  };
};

export const getVisible = async () =>
  (await prisma.product.findMany({ where: { visibility: 'Visible' }, include, orderBy })).map(shape);

export const getAll = async () => (await prisma.product.findMany({ include, orderBy })).map(shape);

/** Public lookup by slug or id — hidden products are not exposed. */
export const getPublic = async (idOrSlug) => {
  const product = await prisma.product.findFirst({
    where: { visibility: 'Visible', OR: [{ slug: idOrSlug }, { id: idOrSlug }] },
    include,
  });
  if (!product) throw new NotFoundError('Product not found.');
  return shape(product);
};

export const getById = async (id) => {
  const product = await prisma.product.findUnique({ where: { id }, include });
  if (!product) throw new NotFoundError('Product not found.');
  return shape(product);
};

const itemRows = (productId, items) =>
  items.map((item, index) => ({
    productId,
    medicineId: item.medicineId,
    quantity: item.quantity,
    unit: item.unit,
    note: item.note,
    sortOrder: index,
  }));

/** Rejects unknown medicines / kit types with a clear message instead of a database error. */
const assertReferences = async ({ items, kitTypeId }) => {
  if (items?.length) {
    const ids = items.map((i) => i.medicineId);
    const found = await prisma.medicine.count({ where: { id: { in: ids } } });
    if (found !== ids.length) throw new BadRequestError('One or more medicines in this kit no longer exist.');
  }
  if (kitTypeId && !(await prisma.kitType.findUnique({ where: { id: kitTypeId } }))) {
    throw new BadRequestError('Selected kit type does not exist.');
  }
};

/** Only one kit can be featured (it drives the home page hero and CTAs). */
const clearOtherFeatured = (tx, id) =>
  tx.product.updateMany({ where: { isFeatured: true, NOT: { id } }, data: { isFeatured: false } });

export const create = async ({ items = [], ...data }) => {
  await assertReferences({ items, kitTypeId: data.kitTypeId });
  const id = data.slug;
  await prisma.$transaction(async (tx) => {
    await tx.product.create({ data: { id, ...data } });
    if (items.length) await tx.kitItem.createMany({ data: itemRows(id, items) });
    if (data.isFeatured) await clearOtherFeatured(tx, id);
  });
  return getById(id);
};

export const update = async (id, { items, ...data }) => {
  await getById(id);
  await assertReferences({ items, kitTypeId: data.kitTypeId });
  await prisma.$transaction(async (tx) => {
    // The id is the original slug and stays stable so existing carts and orders keep working
    await tx.product.update({ where: { id }, data });
    if (items) {
      await tx.kitItem.deleteMany({ where: { productId: id } });
      if (items.length) await tx.kitItem.createMany({ data: itemRows(id, items) });
    }
    if (data.isFeatured) await clearOtherFeatured(tx, id);
  });
  return getById(id);
};

export const remove = async (id) => {
  const product = await getById(id);
  await prisma.product.delete({ where: { id } });
  return product;
};
