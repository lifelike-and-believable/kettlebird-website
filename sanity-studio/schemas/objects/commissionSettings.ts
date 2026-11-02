// Site settings, Commissions: open or closed, and a note (content-editing-site-settings AC-2, AC-3, AC-6).
import { defineField, defineType } from 'sanity';
import { noteMessage, STARTING_VALUES } from '../../lib/site-settings';
import { settingsText, withKeys } from './settingsField';

export default defineType({
  name: 'commissionSettings',
  title: 'Commissions',
  type: 'document',
  initialValue: withKeys(STARTING_VALUES.commissionSettings),
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      ...settingsText('commissionSettings', 'status'),
      options: { list: [{ title: 'Open', value: 'open' }, { title: 'Closed', value: 'closed' }], layout: 'radio', direction: 'horizontal' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      type: 'string',
      ...settingsText('commissionSettings', 'note'),
      validation: (Rule) => Rule.custom(noteMessage),
    }),
  ],
  preview: { prepare: () => ({ title: 'Commissions' }) },
});
