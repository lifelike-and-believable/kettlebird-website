import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'commissionType',
  title: 'Commission Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'Example: "$40-80"'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'exampleImages',
      title: 'Example Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'deliveryTime',
      title: 'Estimated Delivery Time',
      type: 'string'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number'
    })
  ]
});
