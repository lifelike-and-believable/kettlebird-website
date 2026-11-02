// Previous page, Next page, and Done inside an open page (AC-12; design mock-up 3).
import { ArrowLeftIcon, ArrowRightIcon } from '@sanity/icons';
import { Button, Flex, Stack } from '@sanity/ui';
import { useContext } from 'react';
import type { ObjectInputProps } from 'sanity';
import { PagesContext } from './PagesInput';

export function PageItemNav(props: ObjectInputProps) {
  const pages = useContext(PagesContext);
  const last = props.path[props.path.length - 1];
  const key = typeof last === 'object' && last && '_key' in last ? last._key : undefined;
  const index = pages && key ? pages.keys.indexOf(key) : -1;
  const go = (offset: number) => {
    if (!pages) return;
    const target = pages.keys[index + offset];
    if (target) pages.open([...props.path.slice(0, -1), { _key: target }]);
  };
  return (
    <Stack space={4}>
      {props.renderDefault(props)}
      {index >= 0 && (
        <Flex gap={2} justify="space-between">
          <Button icon={ArrowLeftIcon} text="Previous page" mode="ghost" disabled={index === 0} onClick={() => go(-1)} />
          <Flex gap={2}>
            <Button iconRight={ArrowRightIcon} text="Next page" mode="ghost" disabled={index === pages!.keys.length - 1} onClick={() => go(1)} />
            <Button text="Done" tone="primary" onClick={() => pages!.close()} />
          </Flex>
        </Flex>
      )}
    </Stack>
  );
}
