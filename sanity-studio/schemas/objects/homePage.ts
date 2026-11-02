// Site settings, Home page: the artist text (content-editing-site-settings AC-2, AC-6).
import { defineField, defineType } from 'sanity';
import { STARTING_VALUES } from '../../lib/site-settings';
import { settingsText, withKeys } from './settingsField';

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  initialValue: withKeys(STARTING_VALUES.homePage),
  fields: [defineField({ name: 'artistText', type: 'text', rows: 4, ...settingsText('homePage', 'artistText') })],
  preview: { prepare: () => ({ title: 'Home page' }) },
});
