import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'writtenWork',
  title: 'Written Work',
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }]
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link (AO3, etc.)',
      type: 'url'
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date'
    })
  ]
});
