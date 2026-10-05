import prisma from '../config/database.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

const include = {
  medicineCategory: { select: { id: true, slug: true, name: true, icon: true } },
  kitItems: { select: { quantity: true, unit: true, product: { select: { id: true, name: true } } } },
};

const FIELDS = [
  'id', 'name', 'categoryId', 'description', 'activeIngredient', 'dosage', 'warning', 'sideEffects',
  'fdaStatus', 'travelNote', 'compartment', 'alternative', 'symptoms',
];

/** Keeps only real medicine columns and syncs the legacy category name from categoryId. */
const sanitize = async (input) => {
  const data = Object.fromEntries(Object.entries(input ?? {}).filter(([k]) => FIELDS.includes(k)));
  if (data.categoryId !== undefined) {
    if (!data.categoryId) throw new BadRequestError('Please choose a medicine category.');
    const category = await prisma.medicineCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new BadRequestError('Selected medicine category does not exist.');
    data.category = category.name;
  }
  return data;
};

export const getAll = async (search) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { activeIngredient: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { symptoms: { hasSome: [search] } } // search in symptoms array!
        ]
      }
    : {};

  return await prisma.medicine.findMany({
    where,
    include,
    orderBy: { name: 'asc' }
  });
};

export const getById = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include
  });

  if (!medicine) {
    throw new NotFoundError(`Medicine with ID "${id}" was not found.`);
  }

  return medicine;
};

export const create = async (input) => {
  const data = await sanitize(input);
  if (!data.categoryId) throw new BadRequestError('Please choose a medicine category.');
  return await prisma.medicine.create({
    data,
    include
  });
};

export const update = async (id, input) => {
  // Check if exists
  await getById(id);
  const { id: _ignored, ...data } = await sanitize(input); // eslint-disable-line no-unused-vars

  return await prisma.medicine.update({
    where: { id },
    data,
    include
  });
};

export const remove = async (id) => {
  await getById(id);

  return await prisma.medicine.delete({
    where: { id }
  });
};
