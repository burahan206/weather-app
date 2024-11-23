import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import { allicons } from "./icon";

const Weather = () => {
  
  const inputRef = useRef()
  const [weatherData,setWeatherData]  = useState(false);
 

  const search = async (city) => {  //ฟังก์ชันนี้ใช้สำหรับเรียก API และดึงข้อมูลสภาพอากาศตามชื่อเมืองที่ผู้ใช้ระบุ
    if(city === ""){                //ตรวจสอบว่าผู้ใช้กรอกชื่อเมืองหรือยัง ถ้ายังไม่กรอก จะหยุดการทำงานพร้อมแสดง alert
        alert("Enter City Name");
        return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`; //สร้าง URL สำหรับเรียก API ของ OpenWeatherMap โดยใช้ city ที่ผู้ใช้กรอก
      const response = await fetch(url);         //fetch: ดึงข้อมูลจาก URL และแปลงเป็น JSON
      const data = await response.json();

      if(!response.ok){
        alert(data.message);    //ตรวจสอบว่า API ตอบกลับสำเร็จหรือไม่ (response.ok) หากไม่สำเร็จ แสดงข้อความผิดพลาด (data.message)
        return;
      }

      console.log(data);
      const icon = allicons[data.weather[0].icon] || clear_icon;  //ดึงไอคอนสภาพอากาศจาก allicons โดยใช้ icon ที่ได้รับจาก API หากไม่มีไอคอนที่ตรงกัน จะใช้ค่าเริ่มต้น (clear_icon)
      setWeatherData({
        humidity: data.main.humidity,                    //อัปเดต weatherData ด้วยข้อมูลที่ได้จาก API
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon:icon
      })                                                 //หาก error จะรีเซ็ต weatherData เป็น false และแสดงข้อความใน console
    } catch (error) {
        setWeatherData(false);
        console.error("Error in fetching weather data");
    }
  };

  useEffect(()=>{
    search("Yala");    //เมื่อ Component ถูก mount ครั้งแรก ให้เรียกฟังก์ชัน search เพื่อโหลดข้อมูลสภาพอากาศของเมือง Yala
  },[])

  return (
    <div className="weather">
      <div className="search-bar">
         <input ref={inputRef} type="text" placeholder="Search" />   {/* input: ช่องให้ผู้ใช้กรอกชื่อเมือง โดยใช้ inputRef เพื่อดึงค่าจากฟิลด์นี้ */}
         <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>  {/*img: ไอคอนค้นหา เมื่อผู้ใช้คลิก จะเรียกฟังก์ชัน search พร้อมค่าใน input */}
      </div>
       {weatherData?<>                        {/*   หาก weatherData มีค่า จะแสดงไอคอนสภาพอากาศและแสดงข้อมูลอุณหภูมิ (temperature), ชื่อเมือง (location), ความชื้น (humidity), และความเร็วลม (windSpeed)*/}
      <img src={weatherData.icon} alt="" className="weather-icon" /> 
      <p className="temperature">{weatherData.temperature}°c</p>
      <p className="location">{weatherData.location}</p>
      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="" />
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind_icon} alt="" />
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind speed</span>
          </div>
        </div>
      </div>
       </>:<></>}   {/* หากไม่มีข้อมูล (weatherData === false) จะไม่แสดงอะไรเลย */}

      
    </div>
  );
};

export default Weather;
