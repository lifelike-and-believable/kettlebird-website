// Site settings, Contact and social links (content-editing-site-settings AC-2, AC-3, AC-5, AC-6).
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsInputProps } from 'sanity';
import { AddItemButton } from '../../components/AddItemButton';
import { emailMessage, linkMessage, rowTitle, STARTING_VALUES } from '../../lib/site-settings';
import { settingsText, withKeys } from './settingsField';

type Link = { name?: string; url?: string };

export default defineType({
  name: 'contactSettings',
  title: 'Contact and social links',
  type: 'document',
  initialValue: withKeys(STARTING_VALUES.contactSettings),
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      ...settingsText('contactSettings', 'email'),
      validation: (Rule) => Rule.custom(emailMessage),
    }),
    defineField({
      name: 'links',
      type: 'array',
      ...settingsText('contactSettings', 'links'),
      components: { input: (props: ArrayOfObjectsInputProps) => props.renderDefault({ ...props, arrayFunctions: AddItemButton as never }) },
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              ...settingsText('contactSettings', 'linkName'),
              validation: (Rule) => Rule.custom((_, context) => linkMessage('name', context.parent as Link)),
            }),
            defineField({
              name: 'url',
              type: 'string',
              ...settingsText('contactSettings', 'linkUrl'),
              validation: (Rule) => Rule.custom((_, context) => linkMessage('url', context.parent as Link)),
            }),
          ],
          preview: { select: { name: 'name', url: 'url' }, prepare: ({ name, url }) => ({ title: rowTitle(name, url) }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact and social links' }) },
});
