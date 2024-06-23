import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { LookupIcon, DeleteIcon } from "@/components/icons";
import { useAuth } from "@/components/hooks/useAuth";

export default function LikePage() {
  return (
    <DefaultLayout>
      <LikeForm />
    </DefaultLayout>
  );
}

async function fetchInfo(token: string) {
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth 返回的是 0 到 11，所以要加 1
  const day = date.getDate();
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}

function LikeForm() {
  const [likes, setLikes] = useState([]);
  const [sortOption, setSortOption] = useState('dateIncrease');
  const { user } = useAuth();
  const token = user?.token || "no_token";

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchInfo(token);
        setLikes(data.liked_rentals);
      } catch (err) {
        console.error("Error fetching likes: ", err);
      }
    }
    if (token) {
      getData();
    }
  }, [token]);

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

  const removeFromFavorites = async (likeToRemove) => {
    const confirmed = window.confirm(`確定刪除房屋「${likeToRemove.Title}」？`);
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(`${process.env.API_URL}/like`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "rental_id": likeToRemove.R_id })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await fetchInfo(token);
      setLikes(data.liked_rentals);
    } catch (error) {
      console.error('Delete request failed:', error);
    }
  };

  const router = useRouter();
  const handleLookup = (id: any) => {
    router.push(`/rental/${id}`);
  };


  return (
    <div>
      <div className="w-64 mb-5 ml-4">
        <Select label="選擇排序項目" placeholder="上架日期 舊到新" className="max-w-xs" value={sortOption} onChange={(sortOption) => sortBy(sortOption.target.value)}>
          <SelectItem value="dateDecrease" key="dateDecrease">上架日期 新到舊</SelectItem>
          <SelectItem value="dateIncrease" key="dateIncrease">上架日期 舊到新</SelectItem>
          <SelectItem value="priceDecrease" key="priceDecrease">價格 高到低</SelectItem>
          <SelectItem value="priceIncrease" key="priceIncrease">價格 低到高</SelectItem>
          <SelectItem value="sizeDecrease" key="sizeDecrease">面積 大到小</SelectItem>
          <SelectItem value="sizeIncrease" key="sizeIncrease">面積 小到大</SelectItem>
        </Select>
      </div>
      <section className="favorites-list flex flex-wrap">
        {likes.map((like) => (
          <div key={like.R_id} className="favorite-item border p-5 m-4 rounded-lg basis-64">
            <div className="info text-left w-full mt-4">
              <h2 className="text-lg font-semibold">{like.Title}</h2>
              <p>地址：{like.Address}</p>
              <p>價格: {parseInt(like.Price)}/月</p>
              <p>類型: {like.Type}</p>
              <p>臥室數量: {like.Bedroom}</p>
              <p>客廳數量: {like.LivingRoom}</p>
              <p>浴室數量: {like.Bathroom}</p>
              <p>坪數: {parseInt(like.Ping)}</p>
              <p>上架日期: {formatDate(like.PostDate)}</p>
            </div>
            <div className="actions mt-2 ">
              <ButtonGroup>
                <Button onClick={() => handleLookup(like.R_id)} startContent={<LookupIcon />}>查看</Button>
                <Button color="danger" variant="bordered" onClick={() => removeFromFavorites(like)} startContent={<DeleteIcon />}>刪除</Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}