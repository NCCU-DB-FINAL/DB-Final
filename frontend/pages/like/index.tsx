import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { LookupIcon, DeleteIcon } from "@/components/icons";

export default function LikePage() {
  return (
    <DefaultLayout>
      <LikeForm />
    </DefaultLayout>
  );
}

async function fetchInfo() {
  const token = localStorage.getItem('RENT_USER');
  console.log("like token:", token);
  if (!token) {
    throw new Error('No token found');
  }

  // 发起 fetch 请求，并在请求头中包含 JWT 令牌
  const response = await fetch(`${process.env.API_URL}/likes`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error(`Error`);
  } else {
    const data = await response.json();
    return data;
  }
}

function LikeForm() {
  const [likes, setLikes] = useState([]);
  const [sortOption, setSortOption] = useState('dateDecrease');

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchInfo();
        setLikes(data.likes);
      } catch (err) {
        console.error("Error fetching likes: ", err);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    sortBy(sortOption);
  }, [sortOption]);

  const sortBy = (option: string) => {
    setSortOption(option);
    let sortedLikes = [...likes]; // Create a copy of state
    if (option === "dateDecrease") {
      sortedLikes.sort((a, b) => new Date(b.PostDate) - new Date(a.PostDate));
    } else if (option === "dateIncrease") {
      sortedLikes.sort((a, b) => new Date(a.PostDate) - new Date(b.PostDate));
    } else if (option === "priceDecrease") {
      sortedLikes.sort((a, b) => parseInt(b.Price) - parseInt(a.Price));
    } else if (option === "priceIncrease") {
      sortedLikes.sort((a, b) => parseInt(a.Price) - parseInt(b.Price));
    } else if (option === "sizeDecrease") {
      sortedLikes.sort((a, b) => parseInt(b.Ping) - parseInt(a.Ping));
    } else if (option === "sizeIncrease") {
      sortedLikes.sort((a, b) => parseInt(a.Ping) - parseInt(b.Ping));
    }
    setLikes(sortedLikes); // Update state with sorted array
  };

  const removeLike = async (id: any, index: number) => {
    const confirmed = window.confirm(`確定刪除房屋 ${index} ？`);
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${process.env.API_URL}/rental/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await fetchInfo();
      setLikes(data.likes);
    } catch (error) {
      console.error('Delete request failed:', error);
    }
  };

  const router = useRouter();
  const handleEdit = (id: any) => {
    router.push(`/edit/${id}`);
  };


  return (
    <div>
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
        {likes.map((fav) => (
          <div key={fav.L_id} className="favorite-item border p-5 m-4 rounded-lg basis-64">
            <div className="info text-left w-full mt-4">
              <h2 className="text-lg font-semibold">{fav.name}</h2>
              <p>地址：{fav.Address}</p>
              <p>價格：{fav.Price}元/月</p>
              <p>面積：{fav.Ping}平方公尺</p>
              <p>房型：{fav.rooms}</p>
              <p>上架日期：{fav.date}</p>
            </div>
            <div className="actions mt-2 ">
              <ButtonGroup>
                <Button startContent={<LookupIcon />}>查看</Button>
                <Button color="danger" variant="bordered" onClick={() => removeFromFavorites(fav.L_id)} startContent={<DeleteIcon />}>刪除</Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}