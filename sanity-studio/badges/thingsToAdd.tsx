// "3 things to add before publishing", beside Publish (content-editing-organised-editor AC-6).
import { useValidationStatus, type DocumentBadgeComponent } from 'sanity';
import { isItemType, missingFields, thingsToAdd } from '../lib/editor-content';

export const ThingsToAddBadge: DocumentBadgeComponent = (props) => {
  const target = props.draft?._id ?? props.published?._id ?? props.id;
  const { validation } = useValidationStatus(target, props.type, false);
  if (!isItemType(props.type)) return null;
  const errorPaths = validation.filter((marker) => marker.level === 'error').map((marker) => marker.path as unknown[]);
  const label = thingsToAdd(missingFields(props.type, errorPaths).length);
  return label ? { label, color: 'warning' } : null;
};
