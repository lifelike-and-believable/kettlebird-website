// Commission types as the Commissions page's cards, for the page and the preview route.
import type { TypeCard } from '../components/settings/CommissionsContent.astro';
import type { CommissionType } from './queries';
import { urlFor } from './sanity';

export function commissionTypeCards(types: CommissionType[]): TypeCard[] {
  return types.map((type) => ({
    id: type._id,
    name: type.name,
    priceRange: type.priceRange,
    description: type.description,
    deliveryTime: type.deliveryTime,
    images: (type.exampleImages ?? []).slice(0, 3).map((img, i) => ({
      src: urlFor(img).width(300).height(300).fit('crop').auto('format').url(),
      alt: `${type.name} example ${i + 1}`,
    })),
  }));
}
