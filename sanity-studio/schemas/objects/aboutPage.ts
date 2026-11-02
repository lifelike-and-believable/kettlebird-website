// Site settings, About page: portrait, bio, artist statement and quick facts
// (content-editing-site-settings AC-2, AC-3, AC-5, AC-6).
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsInputProps } from 'sanity';
import { AddItemButton } from '../../components/AddItemButton';
import { factMessage, MESSAGES, rowTitle, STARTING_VALUES } from '../../lib/site-settings';
import { settingsText, withKeys } from './settingsField';

export default defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  initialValue: withKeys(STARTING_VALUES.aboutPage),
  fields: [
    defineField({
      name: 'portrait',
      type: 'image',
      ...settingsText('aboutPage', 'portrait'),
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          ...settingsText('aboutPage', 'alt'),
          // A warning, so Publish stays available; only once there's a portrait.
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const hasPicture = Boolean((context.parent as { asset?: unknown } | undefined)?.asset);
              return !hasPicture || (typeof alt === 'string' && alt.trim()) ? true : MESSAGES.altMissing;
            }).warning(),
        }),
      ],
    }),
    defineField({ name: 'bio', type: 'text', rows: 6, ...settingsText('aboutPage', 'bio') }),
    defineField({ name: 'statement', type: 'text', rows: 6, ...settingsText('aboutPage', 'statement') }),
    defineField({
      name: 'facts',
      type: 'array',
      ...settingsText('aboutPage', 'facts'),
      components: { input: (props: ArrayOfObjectsInputProps) => props.renderDefault({ ...props, arrayFunctions: AddItemButton as never }) },
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          title: 'Fact',
          validation: (Rule) => Rule.custom((fact) => factMessage(fact as { label?: string; value?: string })),
          fields: [
            defineField({ name: 'label', type: 'string', ...settingsText('aboutPage', 'factLabel') }),
            defineField({ name: 'value', type: 'string', ...settingsText('aboutPage', 'factValue') }),
          ],
          preview: { select: { label: 'label', value: 'value' }, prepare: ({ label, value }) => ({ title: rowTitle(label, value) }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});
