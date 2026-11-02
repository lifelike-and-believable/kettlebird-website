// "1 thing to fix before publishing", beside Publish on a Site settings item
// (content-editing-site-settings AC-4).
import { useValidationStatus, type DocumentBadgeComponent } from 'sanity';
import { isSettingsType, thingsToFix } from '../lib/site-settings';

export const ThingsToFixBadge: DocumentBadgeComponent = (props) => {
  const target = props.draft?._id ?? props.published?._id ?? props.id;
  const { validation } = useValidationStatus(target, props.type, false);
  if (!isSettingsType(props.type)) return null;
  const label = thingsToFix(validation.filter((marker) => marker.level === 'error').length);
  return label ? { label, color: 'warning' } : null;
};
