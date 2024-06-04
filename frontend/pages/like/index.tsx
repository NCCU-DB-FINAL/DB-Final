import { SetStateAction, useState, useEffect } from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

export default function LikePage() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "房屋名稱1",
      address: "台北市文山區指南路二段64號",
      price: "30,000",
      size: "30",
      rooms: "2房1廳",
      date: "2022-05-21",
    },
    {
      id: 2,
      name: "房屋名稱2",
      address: "台北市安區",
      price: "20,000",
      size: "20",
      rooms: "2房1廳",
      date: "2024-05-20",
    },
    {
      id: 3,
      name: "房屋名稱3",
      address: "台北市大區",
      price: "100,000",
      size: "60",
      rooms: "2房1廳",
      date: "2026-05-19",
    },
    {
      id: 4,
      name: "房屋名稱4",
      address: "台北市大安區政大台北市大安區政大台北市大安區政大台北市大安區政大",
      price: "200,000",
      size: "1000",
      rooms: "2房1廳",
      date: "2026-07-19",
    },
    {
      id: 5,
      name: "房屋名稱5",
      address: "高雄市",
      price: "10,000",
      size: "50",
      rooms: "2房1廳",
      date: "2024-03-19",
    },
    {
      id: 6,
      name: "房屋名稱5",
      address: "高雄市",
      price: "10,000",
      size: "50",
      rooms: "2房1廳",
      date: "2024-03-19",
    },
    {
      id: 7,
      name: "房屋名稱5",
      address: "高雄市",
      price: "10,000",
      size: "50",
      rooms: "2房1廳",
      date: "2024-03-19",
    }
    // 更多房源
  ]);

  const [sortOption, setSortsortOption] = useState("dateDecrease");

  useEffect(() => {
    sortBy(sortOption);
  }, []);

  const sortBy = (sortOption: SetStateAction<string>) => {
    setSortsortOption(sortOption);
    let sortedFavorites = [...favorites];
    if (sortOption === "dateDecrease") {
      sortedFavorites.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    else if (sortOption === "dateIncrease") {
      sortedFavorites.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    else if (sortOption === "priceDecrease") {
      sortedFavorites.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }
    else if (sortOption === "priceIncrease") {
      sortedFavorites.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    }
    else if (sortOption === "sizeDecrease") {
      sortedFavorites.sort((a, b) => parseInt(b.size) - parseInt(a.size));
    }
    else if (sortOption === "sizeIncrease") {
      sortedFavorites.sort((a, b) => parseInt(a.size) - parseInt(b.size));
    }
    setFavorites(sortedFavorites);
  };

  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    // 回傳給DB
  };

  return (
    <DefaultLayout>
      <div className="w-64 mb-5 ml-4">
        <Select label="選擇排序項目" placeholder="上架日期 新到舊" className="max-w-xs" value={sortOption} onChange={(sortOption) => sortBy(sortOption.target.value)}>
          <SelectItem value="dateDecrease" key="dateDecrease">上架日期 新到舊</SelectItem>
          <SelectItem value="dateIncrease" key="dateIncrease">上架日期 舊到新</SelectItem>
          <SelectItem value="priceDecrease" key="priceDecrease">價格 高到低</SelectItem>
          <SelectItem value="priceIncrease" key="priceIncrease">價格 低到高</SelectItem>
          <SelectItem value="sizeDecrease" key="sizeDecrease">面積 大到小</SelectItem>
          <SelectItem value="sizeIncrease" key="sizeIncrease">面積 小到大</SelectItem>
        </Select>
      </div>
      <section className="favorites-list flex flex-wrap">
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-item border p-5 m-4 rounded-lg basis-64">
            <div className="info text-left w-full mt-4">
              <h2 className="text-lg font-semibold">{fav.name}</h2>
              <p>地址：{fav.address}</p>
              <p>價格：{fav.price}元/月</p>
              <p>面積：{fav.size}平方公尺</p>
              <p>房型：{fav.rooms}</p>
              <p>上架日期：{fav.date}</p>
            </div>
            <div className="actions mt-2 ">
              <ButtonGroup>
                <Button startContent={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>}>查看</Button>
                <Button color="danger" variant="bordered" onClick={() => removeFromFavorites(fav.id)} startContent={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>}>刪除
                </Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </section>
    </DefaultLayout>
  );
}