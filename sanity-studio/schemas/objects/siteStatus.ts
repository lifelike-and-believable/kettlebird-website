// A hidden item the editor updates whenever something is deleted or unpublished, so the latest
// change, removals included, can be read from the public dataset (content-editing-know-when-live
// AC-3). It isn't in the menu and can't be created from "Create new".
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteStatus',
  title: 'Site status',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'lastRemoval', title: 'Last removal', type: 'datetime' }),
  ],
});
