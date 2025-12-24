import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comicPage',
  title: 'Comic Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageNumber',
      title: 'Page Number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive()
    }),
    defineField({
      name: 'image',
      title: 'Page Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'panels',
      title: 'Panels',
      type: 'array',
      description: 'Define panel coordinates for frame-by-frame reading',
      of: [
        defineField({
          name: 'panel',
          title: 'Panel',
          type: 'object',
          fields: [
            { name: 'panelNumber', title: 'Panel Number', type: 'number' },
            { name: 'x', title: 'X Position (%)', type: 'number' },
            { name: 'y', title: 'Y Position (%)', type: 'number' },
            { name: 'width', title: 'Width (%)', type: 'number' },
            { name: 'height', title: 'Height (%)', type: 'number' }
          ]
        })
      ]
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'text',
      description: 'Accessibility description for the full page'
    })
  ]
});
