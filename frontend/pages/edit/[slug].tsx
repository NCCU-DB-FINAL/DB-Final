import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from 'react';
import { Input, Spacer, Button, Select, SelectItem } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { taiwanCities, TaiwanCities } from "@/rental_data/taiwan";
import { useRouter } from "next/router";
import { useAuth } from "@/components/hooks/useAuth";



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

async function editRental(slug : number, address: string, title :string , price: number, type: string, bedroom: number, living_room: number, bathroom: number, ping: number, rental_term: string, token : string) {
  const res = await fetch(`${process.env.API_URL}/rental/${slug}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      address,
      title, 
      price,
      type,
      bedroom,
      living_room,
      bathroom,
      ping,
      rental_term,
    }),

  });

  if (!res.ok) return undefined;
  return res.json();
}

export default function EditPage() {
    const router = useRouter();
    const { slug } = router.query;
    const {user} = useAuth();
    const token = user?.token || "no_token";
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");

    const id = parseInt(slug, 10);
    //const [rentalData, setRentalData] = useState<RentalData | null>(null);



    const [form, setForm] = useState({
      address: '',
      title : '',
      price: '',
      type: '',
      bedroom: '',
      living_room: '',
      bathroom: '',
      ping: '',
      rental_term: '',
    });


    
    //value好像只能是string 如果有問題可以看看這個原因
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          getRentalData(id).then(data => {
            if (data) {
                console.log('Rental data:', data);
              
                setForm({
                  address: data.Address,
                  title: data.Title,
                  price: data.Price,
                  type: data.Type,
                  bedroom: data.Bedroom.toString(),
                  living_room: data.LivingRoom.toString(),
                  bathroom: data.Bathroom.toString(),
                  ping: data.Ping,
                  rental_term: data.RentalTerm,
                });
      

                const addressArray = data.Address.split(' ');
                if (addressArray.length === 3) {
                  setSelectedCity(addressArray[0]); 
                  setSelectedDistrict(addressArray[1]);                                
                  setDetailedAddress(addressArray[2]);
                }
                 
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

    //console.log('Form:', form);

    

    
    const handleInputChange = (field: string, value: string) => {
      setForm({ ...form, [field]: value });
      };

    const handleCityChange = (value: string) => {
      setSelectedCity(value);
      setSelectedDistrict(""); 
    };
  
    const handleDistrictChange = (value: string) => {
      setSelectedDistrict(value);
    };
    
  
    const handleDetailedAddressChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      const detailedAddressValue = event.target.value;
      setDetailedAddress(detailedAddressValue);
  
      const input_address = [selectedCity, selectedDistrict, detailedAddressValue].filter(Boolean).join(" ");
      handleInputChange('address', input_address.toString());
      
    };
  
    
  
    //提交到後端API
    const handleSubmit = async() => { 

      try {

        console.log('Form after setForm:', form);
        const response = await editRental(id, form.address, form.title, parseFloat(form.price), form.type, parseInt(form.bedroom, 10), parseInt(form.living_room,10),  parseInt(form.bathroom,10),  parseFloat(form.ping), form.rental_term, token);
        

        if(response) {
          Swal.fire({
            icon: 'success',
            title: '已成功編輯',
            confirmButtonText: '回主頁',
      
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/'
            } 
          });  
        }
        else {
          Swal.fire({
            icon: 'error',
            title: '提交失敗',
            text: '請重新嘗試！',
          });
        }
      } catch (error) {
        window.alert(`系統錯誤 ${error}`);
        console.error("Error when postRental", error);
      }
      
    };
  



    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-5xl font-bold">編輯出租房屋資料</h1>
            <Spacer y={6} />
  
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Select
                label="縣市"       
                defaultSelectedKeys={[selectedCity]}
                selectedKeys={[selectedCity]}
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                {Object.keys(taiwanCities).map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </Select>
         
              <Select
                label="鄉鎮[市]區"
                defaultSelectedKeys={[selectedDistrict]}
                selectedKeys={[selectedDistrict]}
                value={selectedDistrict}                
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                {taiwanCities[selectedCity]?.map((district : string) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </Select>
       
              <Input
                label="詳細地址"
                value={detailedAddress}
                onChange={handleDetailedAddressChange}
              />
          </div>
          <Spacer y={2} />
            <form onSubmit={(e) => e.preventDefault()}>
            <Input
              isClearable
              size="lg"
              label="補充資訊"
              placeholder=" "
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onClear={() => handleInputChange('title', '')}   
            />
            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="價格"
              placeholder=" "
              
              value={form.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onClear={() => handleInputChange('price', '')}   
            />
            <Spacer y={2} />
  
            <Select
                
                items={[
                  { label: '套房', value: '套房' },
                  { label: '雅房', value: '雅房' },
                  { label: '整層', value: '整層' }
                ]}
                label="請選擇房型"
                placeholder=" "
                defaultSelectedKeys={[form.type]}
                selectedKeys={[form.type]}
                value={form.type}
                onChange={(value) => {
                  handleInputChange('type', value.target.value);
                }}
                
              >
                {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
  
            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="房間數"
              placeholder=" "
              value={form.bedroom}
              onChange={(e) => handleInputChange('bedroom', e.target.value)}
              onClear={() => handleInputChange('bedroom', '')} 
            />

            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="客廳數"
              placeholder=" "
              value={form.living_room}
              onChange={(e) => handleInputChange('living_room', e.target.value)}
              onClear={() => handleInputChange('living_room', '')} 
            />
  
            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="廁所數"
              placeholder=" "
              value={form.bathroom}
              onChange={(e) => handleInputChange('bathroom', e.target.value)}
              onClear={() => handleInputChange('bathroom', '')} 
            />
  
            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="坪數"
              placeholder=" "
              value={form.ping}
              onChange={(e) => handleInputChange('ping', e.target.value)}
              onClear={() => handleInputChange('ping', '')} 
            />
  
            <Spacer y={2} />
            <Input
              isClearable
              size="lg"
              label="租期"
              placeholder=" "
              value={form.rental_term}
              onChange={(e) => handleInputChange('rental_term', e.target.value)}
              onClear={() => handleInputChange('rental_term', '')} 
            />
            
            <Spacer y={2} />
            <Button onClick={handleSubmit}>提交</Button>
            </form>
          </div>
        </section>
      </DefaultLayout>
    );
  }
  