import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 120 }
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true, metadata: ['palette', 'lqip'] }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'Featured', value: 'featured' },
          { title: 'Commission', value: 'commission' },
          { title: 'Fanart', value: 'fanart' },
          { title: 'Original Character', value: 'original' },
          { title: 'Work in Progress', value: 'wip' }
        ]
      }
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'date',
      title: 'Date Created',
      type: 'date'
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean'
    }),
    defineField({
      name: 'altText',
      title: 'Alt text',
      type: 'text',
      validation: (Rule) => Rule.max(240)
    })
  ]
});
