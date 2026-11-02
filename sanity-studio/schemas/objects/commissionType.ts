import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { fieldText, ITEM_NAMES, listDetail, requiredMessage } from '../../lib/editor-content';

// A commission type (Commissions). Labels and help: design-organised-editor (Commissions).
export default defineType({
  name: 'commissionType',
  title: ITEM_NAMES.commissionType,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      ...fieldText('commissionType', 'name'),
      validation: (Rule) => Rule.required().error(requiredMessage('commissionType', 'name')),
    }),
    defineField({
      name: 'priceRange',
      type: 'string',
      ...fieldText('commissionType', 'priceRange'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      ...fieldText('commissionType', 'description'),
    }),
    defineField({
      name: 'exampleImages',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      ...fieldText('commissionType', 'exampleImages'),
    }),
    defineField({
      name: 'deliveryTime',
      type: 'string',
      ...fieldText('commissionType', 'deliveryTime'),
    }),
    defineField({
      name: 'order',
      type: 'number',
      ...fieldText('commissionType', 'order'),
    }),
  ],
  preview: {
    select: { title: 'name', media: 'exampleImages.0', priceRange: 'priceRange' },
    prepare: ({ title, media, priceRange }) => ({ title, media, subtitle: listDetail('commissionType', { priceRange }) }),
  },
});
