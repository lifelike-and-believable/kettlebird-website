import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 120 }
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Print', value: 'print' },
          { title: 'Sticker', value: 'sticker' },
          { title: 'Digital', value: 'digital' },
          { title: 'Commission', value: 'commission' }
        ]
      }
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory (optional)',
      type: 'number'
    }),
    defineField({
      name: 'kofiLink',
      title: 'Ko-fi Link',
      type: 'url'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    })
  ]
});
