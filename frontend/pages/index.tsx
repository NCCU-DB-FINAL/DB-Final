import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
  Spinner,
  Button,
  Pagination,
} from "@nextui-org/react";
import { useRef, useState } from "react";
import React from "react";
import { useAsyncList } from "react-stately";
import router from "next/router";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { SearchBox } from "@/components/searchbox";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);

  const searchAreaRef = useRef("");
  const searchMaxPingRef = useRef("");
  const searchMinPingRef = useRef("");
  const searchMaxPriceRef = useRef("");
  const searchMinPriceRef = useRef("");

  const priceOnChanges = [
    (value: string) => {
      searchMinPriceRef.current = value;
    },
    (value: string) => {
      searchMaxPriceRef.current = value;
    },
  ];
  const pingOnChanges = [
    (value: string) => {
      searchMinPingRef.current = value;
    },
    (value: string) => {
      searchMaxPingRef.current = value;
    },
  ];

  async function fetchSearchResults() {
    const res = await fetch(
      `${process.env.API_URL}/rental/search?` +
        new URLSearchParams({
          area: searchAreaRef.current,
          max_ping: searchMaxPingRef.current,
          min_ping: searchMinPingRef.current,
          max_price: searchMaxPriceRef.current,
          min_price: searchMinPriceRef.current,
        }).toString(),
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      },
    );

    let json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    // Format date and number
    json.rentals.forEach((rental: any) => {
      rental.PostDate = formatDate(rental.PostDate);
      rental.Price = parseInt(rental.Price);
      rental.Ping = parseInt(rental.Ping);
    });

    return json;
  }

  let list = useAsyncList({
    async load() {
      setIsLoading(true);
      let items = [];

      try {
        const json = await fetchSearchResults();

        items = json.rentals;
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }

      return {
        items: items,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  function onSearch() {
    list.reload();
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{siteConfig.name}&nbsp;</h1>
          <h4 className={subtitle({ class: "mt-4" })}>房屋出租平台🐷</h4>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4 justify-center">
            <div className="flex gap-4 w-full flex-col">
              <SearchBox
                className="w-full"
                inputRef={searchAreaRef}
                placeholder="搜尋地址"
              />
              <div className="flex flex-row gap-4 columns-2">
                <PriceInput onValueChanges={priceOnChanges} />
                <PingInput onValueChanges={pingOnChanges} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button color="primary" onClick={onSearch}>
                搜尋
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SearchRestuls
            className="w-full px-5"
            columns={rentalColumns}
            isLoading={isLoading}
            rows={list.items as RowsType}
            sortDescriptor={list.sortDescriptor}
            onRowAction={(key) => {
              router.push(`/rental/${key}`);
            }}
            onSortChange={list.sort}
          />
        </div>
      </section>
    </DefaultLayout>
  );
}

interface RowType {
  R_id: number;
  Address: any;
  Price: number;
  Type: any;
  Bedroom: number;
  LivingRoom: number;
  Bathroom: number;
  Ping: number;
  RentalTerm: any;
  PostDate: string;
  L_id: number;
}

type RowsType = RowType[];

interface SearchRestulsProps {
  className: string;
  columns: {
    key: string;
    label: string;
  }[];
  rows: RowsType;
  onRowAction: (row: any) => void;
  onSortChange: ({ items, sortDescriptor }: any) => void;
  sortDescriptor: any;
  isLoading?: boolean;
}

const SearchRestuls = ({
  className,
  columns,
  rows,
  onRowAction,
  onSortChange,
  sortDescriptor,
  isLoading,
}: SearchRestulsProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Table
      aria-label="租屋資訊搜尋結果"
      bottomContent={
        <div className="flex w-full justify-center mt-4">
          <Pagination
            isCompact
            showControls
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      className={className}
      color="default"
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      onRowAction={onRowAction}
      onSortChange={onSortChange}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"查無相關租屋資訊"} items={paginatedRows}>
        {(item) => (
          <TableRow key={item.R_id} className="cursor-pointer">
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface InputProps {
  className?: string | null;
  onValueChanges?: ((value: string) => void)[];
}

interface InputPairProps {
  className: string;
  placeholder: string;
  startContent?: string | null;
  endContent?: string | null;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  inputClassName: string;
  onValueChanges?: ((value: string) => void)[];
}

const InputPair = ({
  className,
  startContent = null,
  variant,
  inputClassName,
  placeholder,
  endContent = null,
  onValueChanges = [],
}: InputPairProps) => {
  const inputs = [];

  for (let i = 0; i < 2; i++) {
    inputs.push(
      <div>
        <Input
          isClearable
          className={inputClassName}
          endContent={endContent}
          inputMode="numeric"
          placeholder={placeholder}
          startContent={startContent}
          type="text"
          variant={variant}
          onValueChange={onValueChanges[i]}
        />
      </div>,
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-row gap-2">
        <div className="flex gap-2 place-content-center">
          {inputs[0]}
          <div className="place-content-center">
            <p> ~ </p>
          </div>
          {inputs[1]}
        </div>
      </div>
    </div>
  );
};

const PriceInput = ({ className, onValueChanges }: InputProps) => {
  return (
    <InputPair
      className={className || ""}
      inputClassName="w-32"
      placeholder="價錢"
      startContent="$"
      variant="bordered"
      onValueChanges={onValueChanges}
    />
  );
};

const PingInput = ({ className, onValueChanges }: InputProps) => {
  return (
    <InputPair
      className={className || ""}
      inputClassName="w-20"
      placeholder="坪"
      variant="bordered"
      onValueChanges={onValueChanges}
    />
  );
};

const rentalColumns = [
  // {
  //   key: "R_id",
  //   label: "ID",
  // },
  {
    key: "Title",
    label: "標題",
  },
  {
    key: "Address",
    label: "地址",
  },
  {
    key: "Price",
    label: "價錢",
  },
  {
    key: "Type",
    label: "類型",
  },
  {
    key: "Bedroom",
    label: "房",
  },
  {
    key: "LivingRoom",
    label: "廳",
  },
  {
    key: "Bathroom",
    label: "衛",
  },
  {
    key: "Ping",
    label: "坪數",
  },
  {
    key: "RentalTerm",
    label: "租期",
  },
  {
    key: "PostDate",
    label: "發布日期",
  },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("sv").slice(5).replace("-", "/");
};
