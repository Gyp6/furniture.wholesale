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
  value?: string[] | null;
  onValueChange?: (value: string[] | null) => void;
}

export function ComboboxSelect({
  className,
  items,
  value,
  onValueChange,
  ...props
}: Props) {
  const single = value?.[0] ?? null;

  const handleChange = (val: string | null) => {
    onValueChange?.(val ? [val] : null);
  };

  return (
    <Combobox
      items={items}
      value={single}
      onValueChange={handleChange}
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
