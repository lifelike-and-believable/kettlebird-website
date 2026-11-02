import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { fieldText, ITEM_NAMES, listDetail, requiredMessage, SHOP_SECTION_OPTIONS } from '../../lib/editor-content';

// A product (Shop). Labels and help: design-organised-editor (Shop).
export default defineType({
  name: 'product',
  title: ITEM_NAMES.product,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      ...fieldText('product', 'name'),
      validation: (Rule) => Rule.required().error(requiredMessage('product', 'name')),
    }),
    defineField({
      name: 'category',
      type: 'string',
      ...fieldText('product', 'category'),
      options: { list: SHOP_SECTION_OPTIONS, layout: 'radio' },
      validation: (Rule) => Rule.required().error(requiredMessage('product', 'category')),
    }),
    defineField({
      name: 'price',
      type: 'string',
      ...fieldText('product', 'price'),
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      ...fieldText('product', 'images'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      ...fieldText('product', 'description'),
    }),
    defineField({
      name: 'kofiLink',
      type: 'url',
      ...fieldText('product', 'kofiLink'),
    }),
    // Hidden, values kept: the shop doesn't use them yet (the shop epic).
    defineField({
      name: 'slug',
      type: 'slug',
      hidden: true,
      options: { source: 'name', maxLength: 120 },
    }),
    defineField({
      name: 'tags',
      type: 'array',
      hidden: true,
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'inventory',
      type: 'number',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'images.0', category: 'category' },
    prepare: ({ title, media, category }) => ({ title, media, subtitle: listDetail('product', { category }) }),
  },
});
