import { Input } from "@nextui-org/react";

import { SearchIcon } from "@/components/icons";

interface SearchBoxProps {
  className: string;
  placeholder: string;
  inputRef?: React.MutableRefObject<string>;
}

export function SearchBox({
  className,
  placeholder,
  inputRef,
}: SearchBoxProps) {
  function handleChange(value: string) {
    if (!inputRef) return;
    inputRef.current = value;
  }

  return (
    <Input
      isClearable
      className={className}
      placeholder={placeholder}
      startContent={<SearchIcon />}
      variant="bordered"
      onValueChange={handleChange}
    />
  );
}
