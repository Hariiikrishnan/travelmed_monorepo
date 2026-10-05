import { z } from 'zod';
import prisma from '../config/database.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { revalidateWebsite } from '../utils/revalidateWebsite.js';

/**
 * CRUD for the two admin-managed lookup lists: kit types (group kits on the website)
 * and medicine categories (group medicines, with the icon shown in "What's included").
 */

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const logChange = (req, action, changes) =>
  prisma.activityLog.create({ data: { user: req.user?.name || 'System Admin', action, changes } }).catch(() => {});

const kitTypeSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().max(60).optional(),
  description: z.string().trim().max(500).default(''),
  sortOrder: z.number().int().min(0).max(999).default(0),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

const medicineCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().max(60).optional(),
  icon: z.string().trim().max(300).default(''),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

const resources = {
  kitType: {
    label: 'Kit Type',
    schema: kitTypeSchema,
    model: () => prisma.kitType,
    usage: { products: true },
    inUseMessage: (n) => `This kit type is used by ${n} kit${n === 1 ? '' : 's'}. Move them to another type first.`,
    publicWhere: { status: 'Active' },
  },
  medicineCategory: {
    label: 'Medicine Category',
    schema: medicineCategorySchema,
    model: () => prisma.medicineCategory,
    usage: { medicines: true },
    inUseMessage: (n) => `This category has ${n} medicine${n === 1 ? '' : 's'}. Move them to another category first.`,
    publicWhere: {},
  },
};

const withUsage = (row) => {
  const { _count, ...rest } = row;
  return { ...rest, usage: Object.values(_count ?? {})[0] ?? 0 };
};

export const crud = (key) => {
  const r = resources[key];
  const orderBy = [{ sortOrder: 'asc' }, { name: 'asc' }];

  return {
    listPublic: async (req, res, next) => {
      try {
        const rows = await r.model().findMany({ where: r.publicWhere, orderBy });
        res.status(200).json({ success: true, data: rows });
      } catch (err) {
        next(err);
      }
    },

    listAll: async (req, res, next) => {
      try {
        const rows = await r.model().findMany({ orderBy, include: { _count: { select: r.usage } } });
        res.status(200).json({ success: true, data: rows.map(withUsage) });
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      try {
        const data = r.schema.parse(req.body);
        const row = await r.model().create({ data: { ...data, slug: slugify(data.slug || data.name) } });
        await logChange(req, `${r.label} Created`, row.name);
        await revalidateWebsite('product');
        res.status(201).json({ success: true, data: { ...row, usage: 0 } });
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      try {
        const parsed = r.schema.partial().parse(req.body);
        const data = Object.fromEntries(Object.entries(parsed).filter(([k]) => k in req.body));
        if (data.slug !== undefined || data.name !== undefined) data.slug = slugify(data.slug || data.name);
        const existing = await r.model().findUnique({ where: { id: req.params.id } });
        if (!existing) throw new NotFoundError(`${r.label} not found.`);

        const row = await prisma.$transaction(async (tx) => {
          const updated = await tx[key].update({ where: { id: req.params.id }, data, include: { _count: { select: r.usage } } });
          // Keep the legacy medicine.category text in step with the category name
          if (key === 'medicineCategory' && data.name && data.name !== existing.name) {
            await tx.medicine.updateMany({ where: { categoryId: updated.id }, data: { category: updated.name } });
          }
          return updated;
        });
        await logChange(req, `${r.label} Updated`, row.name);
        await revalidateWebsite('product');
        res.status(200).json({ success: true, data: withUsage(row) });
      } catch (err) {
        next(err);
      }
    },

    remove: async (req, res, next) => {
      try {
        const row = await r.model().findUnique({ where: { id: req.params.id }, include: { _count: { select: r.usage } } });
        if (!row) throw new NotFoundError(`${r.label} not found.`);
        const used = withUsage(row).usage;
        if (used > 0) throw new BadRequestError(r.inUseMessage(used));
        await r.model().delete({ where: { id: row.id } });
        await logChange(req, `${r.label} Deleted`, row.name);
        await revalidateWebsite('product');
        res.status(200).json({ success: true, data: { id: row.id } });
      } catch (err) {
        next(err);
      }
    },
  };
};
