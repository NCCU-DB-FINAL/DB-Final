import { Input } from "@nextui-org/react";

import { SearchIcon } from "@/components/icons";

interface SearchBoxProps {
  className: string;
}

export const SearchBox = ({ className }: SearchBoxProps) => (
  <Input
    isClearable
    className={className}
    placeholder="Search TODO"
    startContent={
      <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
    }
    variant="faded"
  />
);
