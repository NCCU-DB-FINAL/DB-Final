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
  Input,
  Button,
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  getKeyValue,} from "@nextui-org/react";
  import React, {useState} from "react";
  import Rating from 'react-rating-stars-component';
  import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
  import Swal from 'sweetalert2';


  //要先從其他頁面get到房子的ID 透過ID來呈現頁面

  export default function RentalPage() {
    const router = useRouter();
    

    const [favorite, setFavorite] = useState(false);
    const toggleFavorite = () => {
      setFavorite((prev) => {
        const newFavoriteState = !prev;
        if (newFavoriteState) {
          console.log('已加入收藏');
        } else {
          console.log('已取消收藏');
        }
        return newFavoriteState;
      });
    };


    const [comment, setComment] = useState("");
    
    const [rating, setRating] = useState<number>(0);
    const handleChange = (value : number) => {
      setRating(value);
    };
    const handleSubmit = () => {
      console.log("星星數量:", rating);
      console.log("評論:", comment);
      // 在這裡執行提交後的操作，比如發送給後端保存等


      Swal.fire({
        icon: 'success',
        title: '已成功評論',
      })
    };

    
    const data = { // Declare the 'data' variable
      id: 1,
      address: "台北市文山區指南路二段64號",
      price: "30,000",
      Type: "雅房",
      Bedroom: "2",
      LivingRoom: "3",
      Bathroom: "2",
      Ping: "30",
      RentalTerm: "一年",
      PostDate : "2022-05-21",
      L_Name : "王小明",
      L_Phone : "0912345678",
      reviews: [
        {
            "Timestamp": "2023-05-21",
            "rating": 4,
            "comment": "4星好評"
        },
        {
            "Timestamp": "2023-04-10",
            "rating": 5,
            "comment": "這是一個範例評論2"
        },
        {
            "Timestamp": "2023-02-16",
            "rating": 3,
            "comment": "這是一個範例評論3"
        },
        {
          "Timestamp": "2023-02-17",
          "rating": 3,
          "comment": "測試測試"
        },
        {
          "Timestamp": "2023-02-15",
          "rating": 3,
          "comment": "這是一個範例評論5"
        }
      ]

      
    };
    const columns = [
      {
        key: "Timestamp",
        label: "TimeStamp",
      },
      {
        key: "rating",
        label: "Rating",
      },
      {
        key: "comment",
        label: "Comment",
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
                src="https://cdn.discordapp.com/attachments/1035612885721821319/1247852507820986430/5njp9yPKp9.png?ex=666188b5&is=66603735&hm=bb6a05a2cb0b5a6f9bc7c2f856c7a207512df5becbfddd1cde4765866b579bf2&"
                width={40}
              />
      

              <p className="text-small text-default-500">聯絡人 : {data.L_Name}</p>
              <p className="text-small text-default-500">連絡電話 : {data.L_Phone}</p>
            
              <button onClick={toggleFavorite} className="top-rated-car-react-button">
                {favorite ? (
                  <MdFavorite style={{ color: "#F76631" , fontSize :"24px" }} />
                ) : (
                  <MdFavoriteBorder style={{ color: "#F76631" ,fontSize :"24px"}} />
                )}
              </button>


  
            </CardHeader>

            
            <Divider/>
            <CardBody>
              <h4 className="font-bold text-large">房屋地址</h4>
              <Spacer y={2} />
              <p>{data.address}</p>
            </CardBody>
            <Divider/>

            <Divider/>
            <CardBody>
              <h4 className="font-bold text-large">{data.Type}</h4>
              
              <Spacer y={2} />
              <div className="flex h-6 items-center space-x-6 text-small">
              
              <p>廁所 : {data.Bathroom}</p>
              <Divider orientation="vertical" />
              <p>客廳 : {data.LivingRoom}</p>
              <Divider orientation="vertical" />
              <p>房間 : {data.Bedroom}</p>
              <Divider orientation="vertical" />
              <p>坪數 : {data.Ping}</p>
              <Spacer y={2} /> 
              </div>
            </CardBody>
            <Divider/>

            <Divider/>
            <CardBody>
              <h4 className="font-bold text-large">租期{data.RentalTerm}</h4>
              <Spacer y={2} />
              <p>{data.price}/月</p>
            </CardBody>
            <Divider/>

            
            <CardFooter>
              <p className="text-small text-default-500">發布日期 : {data.PostDate}</p>
            </CardFooter>
          </Card>

          <Spacer y={10} />


        <div>
          <Input
            label="請輸入房屋評論"
            className="max-w-[600px]"
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

          <Button onClick={handleSubmit}>送出評論</Button>
        </div>


      <Spacer y={10} />
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={data.reviews}>
          {(item) => (
            <TableRow key={item.Timestamp}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

        
        </div>
      </section>
    </DefaultLayout>
  );
}

