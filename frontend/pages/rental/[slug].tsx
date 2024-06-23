import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Spacer,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
  Textarea
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Rating from 'react-rating-stars-component';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Swal from 'sweetalert2';
import { useAuth } from "@/components/hooks/useAuth";

interface Review {
  Timestamp: string;
  Rating: number;
  Comment: string;
}

interface RentalData {
  R_id: number;
  title: string;
  Address: string;
  Price: string;
  Type: string;
  Bedroom: number;
  LivingRoom: number;
  Bathroom: number;
  Ping: string;
  RentalTerm: string;
  PostDate: string;
  L_name: string;
  L_PhoneNum: string;
  Reviews: Review[];
}

interface LikeData {
  R_id: number;
  title: string;
  Address: string;
  Price: number;
  Type: string;
  Bedroom: number;
  LivingRoom: number;
  Bathroom: number;
  Ping: number;
  RentalTerm: string;
  PostDate: string;
  L_id: number;
}

async function checkUserLike(token: string) {
  const res = await fetch(`${process.env.API_URL}/likes`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) return undefined;
  return res.json();
}

async function getRentalData(id: number) {
  try {
    const res = await fetch(`${process.env.API_URL}/rental/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching rental data:', error);
    return undefined;
  }
}

async function addLike(rental_id: number, token: string) {
  const res = await fetch(`${process.env.API_URL}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "rental_id": rental_id
    }),
  });

  if (!res.ok) return undefined;

  // return res.json();
}

async function deleteLike(rental_id: number, token: string) {
  console.log("執行中...");
  const res = await fetch(`${process.env.API_URL}/like`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "rental_id": rental_id
    })
  });

  if (!res.ok) {
    console.log("執行失敗");
    return undefined;
  }

  console.log("執行成功");

  // return res.json();
}


async function postComment(rating: number, comment: string, token: string, rental_id: number) {
  const res = await fetch(`${process.env.API_URL}/comment/${rental_id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      rating,
      comment
    }),
  });

  if (!res.ok) return undefined;

  return res.json();
}

//要先從其他頁面get到房子的ID 透過ID來呈現頁面

export default function RentalPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, isLoggedIn } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const token = user?.token || "no_token";
  const [rentalData, setRentalData] = useState<RentalData | null>(null);

  const id = parseInt(slug, 10);



  useEffect(() => {
    const fetchData = async () => {
      try {
        getRentalData(id).then(data => {
          if (data) {
            setRentalData(data);
            console.log('Rental data fetched:', data);

          } else {
            console.log('Failed to fetch rental data.');
          }
        });

      } catch (error) {
        window.alert(`系統錯誤 ${error}`);
        console.error("Error when login", error);
      }
    };

    fetchData();

  }, [slug]);


  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (isLoggedIn()) {
          const likeData = await checkUserLike(token);
          //console.log('Like data:', likeData);
          const likedIds = likeData.liked_rentals.map((liked_rentals: LikeData) => liked_rentals.R_id);


          if (slug && likedIds.includes(Number(slug))) {
            setFavorite(true);
          } else {
            setFavorite(false);
          }
        }
      } catch (error) {

        console.error('Error fetching likes:', error);
      }
    };

    if (isLoggedIn()) {
      fetchLikes();
    }
  }, [isLoggedIn(), slug]);


  const toggleFavorite = () => {
    setFavorite((prev) => {
      const newFavoriteState = !prev;
      if (newFavoriteState) {
        addLike(id, token);
        console.log('收藏');


      } else {
        deleteLike(id, token);
        console.log('取消收藏');
      }
      return newFavoriteState;
    });
  };


  const handleChange = (value: number) => {
    setRating(value);
  };


  const handleSubmit = async () => {
    console.log("星星數量:", rating);
    console.log("評論:", comment);
    // 在這裡執行提交後的操作，比如發送給後端保存等
    const result = await postComment(rating, comment, token, id);
    setRating(0);
    setComment("");

    if (result != undefined) {
      Swal.fire({
        icon: 'success',
        title: '已成功評論',
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '評論失敗',
      })
    }
  };


  const data = { // Declare the 'data' variable

    Reviews: []
  };

  data.Reviews = rentalData?.Reviews || [];

  function convertToTaiwanTime(gmtTimeStr: string) {
    const gmtDate = new Date(gmtTimeStr);
    const options = {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(gmtDate);
  }


  data.Reviews = data.Reviews.map(review => ({
    ...review,
    Timestamp: convertToTaiwanTime(review.Timestamp)
  }));


  const convertToTaiwanDate = (gmtTimeStr: string) => {
    const gmtDate = new Date(gmtTimeStr);
    const options = {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('zh-TW', options);
    return formatter.format(gmtDate);
  };

  const time = rentalData?.PostDate ? convertToTaiwanDate(new Date(rentalData.PostDate).toISOString()) : '';




  const totalReviews = data.Reviews.length;
  const averageRating = data.Reviews.reduce((acc, review) => acc + review.Rating, 0) / totalReviews;

  const columns = [
    {
      key: "Timestamp",
      label: "評論時間",
    },
    {
      key: "Rating",
      label: "評分",
    },
    {
      key: "Comment",
      label: "留言",
    },
  ]


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">


          <Spacer y={2} />
          <Card className="max-w-[600px]">
            <CardHeader className="flex gap-8">
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src="https://cdn-icons-png.freepik.com/512/195/195492.png"
                width={40}
              />


              <p className="text-small text-default-500">聯絡人 : {rentalData?.L_Name}</p>
              <p className="text-small text-default-500">連絡電話 : {rentalData?.L_PhoneNum}</p>


              {isLoggedIn() ? (
                <button onClick={toggleFavorite} className="top-rated-car-react-button">

                  {favorite ? (
                    <MdFavorite style={{ color: "#F76631", fontSize: "24px" }} />
                  ) : (
                    <MdFavoriteBorder style={{ color: "#F76631", fontSize: "24px" }} />
                  )}
                </button>
              ) : (
                <MdFavoriteBorder style={{ color: "#F76631", fontSize: "24px" }} />

              )}




            </CardHeader>


            <Divider />
            <CardBody>
              <h4 className="font-bold text-large">房屋地址</h4>
              <Spacer y={2} />
              <p>{rentalData?.Address}</p>

            </CardBody>
            <Divider />

            <Divider />
            <CardBody>
              <h4 className="font-bold text-large">補充資訊</h4>
              <Spacer y={2} />
              <p>{rentalData?.Title}</p>

            </CardBody>
            <Divider />

            <Divider />
            <CardBody>
              <h4 className="font-bold text-large">{rentalData?.Type}</h4>

              <Spacer y={2} />
              <div className="flex h-6 items-center space-x-6 text-small">

                <p>廁所 : {rentalData?.Bathroom}</p>
                <Divider orientation="vertical" />
                <p>客廳 : {rentalData?.LivingRoom}</p>
                <Divider orientation="vertical" />
                <p>房間 : {rentalData?.Bedroom}</p>
                <Divider orientation="vertical" />
                <p>坪數 : {rentalData?.Ping}</p>
                <Spacer y={2} />
              </div>
            </CardBody>
            <Divider />

            <Divider />
            <CardBody>
              <h4 className="font-bold text-large"> {rentalData?.RentalTerm}</h4>
              <Spacer y={2} />
              <p>{rentalData?.Price}/月</p>
            </CardBody>
            <Divider />


            <CardFooter>
              <p className="text-small text-default-500">發布日期 : {time}</p>
            </CardFooter>
          </Card>







          <Spacer y={10} />
          <div className="flex justify-between mt-4">
            <p className="text-default-500">平均評分: {averageRating.toFixed(2)}</p>
            <p className="text-small text-default-500">{totalReviews} 篇評論</p>

          </div>
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data.Reviews}>
              {(item) => (
                <TableRow key={item.Comment}>
                  {(columnKey) => (
                    <TableCell className="text-left">
                      {columnKey === "Rating" ? (
                        <Rating
                          count={5}
                          value={item[columnKey]}
                          size={20}
                          edit={false}
                          activeColor="#ffd700"
                        />
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}

            </TableBody>
          </Table>

          <Spacer y={10} />


          {isLoggedIn() ? (
            <Button onPress={onOpen} color="primary">我要評論</Button>
          ) : (
            <p className="text-small text-default-500">登入使用評論功能</p>
          )}


          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">寫下我的評論</ModalHeader>
                  <ModalBody >
                    <Textarea
                      label=""
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      color="primary"
                    />

                    <Rating
                      count={5}
                      value={rating}
                      onChange={handleChange}
                      size={20}
                      activeColor="#ffd700"
                    />


                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onClick={handleSubmit}>
                      送出
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

        </div>
      </section>
    </DefaultLayout>
  );
}

