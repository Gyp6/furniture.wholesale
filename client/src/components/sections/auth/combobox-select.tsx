import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  type ComboboxInputProps,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/shadcn/combobox';

interface Props extends Omit<ComboboxInputProps, 'value'> {
  className?: string;
  items: string[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}

export function ComboboxSelect({
  className,
  items,
  value,
  onValueChange,
  ...props
}: Props) {
  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={onValueChange}
    >
      <ComboboxInput
        className={className}
        showClear
        {...props}
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {item => (
            <ComboboxItem
              key={item}
              value={item}
            >
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
