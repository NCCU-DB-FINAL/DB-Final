import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { EditIcon, DeleteIcon } from "@/components/icons";
import { useAuth } from "@/components/hooks/useAuth";

export default function PostPage() {
  return (
    <DefaultLayout>
      <PostForm />
    </DefaultLayout>
  );
}

async function fetchInfo(token: string) {
  // 发起 fetch 请求，并在请求头中包含 JWT 令牌
  const response = await fetch(`${process.env.API_URL}/rental`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Error");
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

function PostForm() {
  const [rentals, setRentals] = useState([]);
  const [sortOption, setSortOption] = useState('dateIncrease');
  const { user } = useAuth();
  const token = user?.token || "no_token";

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchInfo(token);
        setRentals(data.rentals);
      } catch (err) {
        console.error("Error fetching rentals: ", err);
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
    let sortedRentals = [...rentals]; // Create a copy of state
    switch (option) {
      case "dateDecrease":
        sortedRentals.sort((a, b) => new Date(b.PostDate).getTime() - new Date(a.PostDate).getTime());
        break;
      case "dateIncrease":
        sortedRentals.sort((a, b) => new Date(a.PostDate).getTime() - new Date(b.PostDate).getTime());
        break;
      case "priceDecrease":
        sortedRentals.sort((a, b) => parseInt(b.Price) - parseInt(a.Price));
        break;
      case "priceIncrease":
        sortedRentals.sort((a, b) => parseInt(a.Price) - parseInt(b.Price));
        break;
      case "sizeDecrease":
        sortedRentals.sort((a, b) => parseInt(b.Ping) - parseInt(a.Ping));
        break;
      case "sizeIncrease":
        sortedRentals.sort((a, b) => parseInt(a.Ping) - parseInt(b.Ping));
        break;
      default:
        break;
    }
    setRentals(sortedRentals); // Update state with sorted array
  };

  const removePost = async (rentalToRemove) => {
    const confirmed = window.confirm(`確定刪除房屋「${rentalToRemove.Title}」？`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/rental/${rentalToRemove.R_id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await fetchInfo(token);
      setRentals(data.rentals);
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
        <Select label="選擇排序項目" placeholder="發布日期 舊到新" className="max-w-xs" value={sortOption} onChange={(sortOption) => sortBy(sortOption.target.value)}>
          <SelectItem value="dateDecrease" key="dateDecrease">發佈日期 新到舊</SelectItem>
          <SelectItem value="dateIncrease" key="dateIncrease">發佈日期 舊到新</SelectItem>
          <SelectItem value="priceDecrease" key="priceDecrease">價格 高到低</SelectItem>
          <SelectItem value="priceIncrease" key="priceIncrease">價格 低到高</SelectItem>
          <SelectItem value="sizeDecrease" key="sizeDecrease">面積 大到小</SelectItem>
          <SelectItem value="sizeIncrease" key="sizeIncrease">面積 小到大</SelectItem>
        </Select>
      </div>
      <section className="favorites-list flex flex-wrap">
        {rentals.map((rental) => (
          <div key={rental.R_id} className="favorite-item border p-5 m-4 rounded-lg basis-64">
            <div className="info text-left w-full mt-4">
              <h2 className="text-lg font-semibold">{rental.Title}</h2>
              <p>地址: {rental.Address}</p>
              <p>價格: {parseInt(rental.Price)}/月</p>
              <p>類型: {rental.Type}</p>
              <p>臥室數量: {rental.Bedroom}</p>
              <p>客廳數量: {rental.LivingRoom}</p>
              <p>浴室數量: {rental.Bathroom}</p>
              <p>坪數: {parseInt(rental.Ping)}</p>
              <p>上架日期: {formatDate(rental.PostDate)}</p>
            </div>
            <div className="actions mt-2 ">
              <ButtonGroup>
                <Button onClick={() => handleEdit(rental.R_id)} startContent={<EditIcon />}>編輯</Button>
                <Button color="danger" variant="bordered" onClick={() => removePost(rental)} startContent={<DeleteIcon />}>刪除</Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}