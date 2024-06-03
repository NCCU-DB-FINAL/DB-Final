import DefaultLayout from "@/layouts/default";
import { useState } from 'react';
import { Input, Spacer, Button, Select, SelectItem } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { taiwanCities, TaiwanCities } from "@/rental_data/taiwan";


export default function PublishPage() {
  const [form, setForm] = useState({
    address: '',
    price: '',
    type: '',
    bedroom: '',
    living_room: '',
    bathroom: '',
    ping: '',
    rental_term: '',
    landLord_id: ''
  });

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict(""); // 重置地區
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
  };
  

  const handleDetailedAddressChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const detailedAddressValue = event.target.value;
    setDetailedAddress(detailedAddressValue);

    const input_address = [selectedCity, selectedDistrict, detailedAddressValue].filter(Boolean).join(", ");
    handleInputChange('address', input_address.toString());
    
  };

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });

  };

  //提交到後端API
  const handleSubmit = () => {

    // const input_address = [selectedCity, selectedDistrict, detailedAddress].filter(Boolean).join(", ");
    // console.log('input', input_address);
    // handleInputChange('address', input_address.toString());


    console.log('Form after setForm:', form);
    Swal.fire({
      icon: 'success',
      title: '已成功刊登',
      confirmButtonText: '回主頁',
      showCancelButton: true,
      cancelButtonText: '繼續刊登'

    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/'
      } else if (result.isDismissed) {
        window.location.reload();
      }
    });  

    // Swal.fire({
    //   icon: 'error',
    //   title: '提交失敗',
    //   text: '請重新嘗試！',
    // });

    setForm({
      address: '',
      price: '',
      type: '',
      bedroom: '',
      living_room: '',
      bathroom: '',
      ping: '',
      rental_term: '',
      landLord_id: ''
    });

    
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-5xl font-bold">請輸入刊登房屋資料</h1>
          <Spacer y={6} />

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Select
              label="縣市"
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

          <form onSubmit={(e) => e.preventDefault()}>
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
            value={form.living_room }
            onChange={(e) => handleInputChange('living_room', e.target.value)}
            onClear={() => handleInputChange('living_room', '')} 
          />

          <Spacer y={2} />
          <Input
            isClearable
            size="lg"
            label="廁所數"
            placeholder=" "
            value={form.bathroom }
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
