import React, { useContext } from 'react'
import data from '../ContextApi'
import{FacebookShareButton,TwitterShareButton,LinkedinShareButton,TelegramShareButton,WhatsappShareButton, WhatsappIcon, TelegramIcon, LinkedinIcon, TwitterIcon} from 'react-share'

//import { css } from 'emotion';
//import FaFacebook from 'react-icons/lib/fa/facebook';
//import { ShareButtonRectangle, ShareBlockStandard } from 'react-custom-share';
import axios from "axios"
import Button from 'react-bootstrap/Button';


const Home = () => {
  const {userdata,setUserData} = useContext(data)
  console.log(userdata.firstName)
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(false);
  const logout = ()=>{
    setUserData({})
  }
  // fileSelectedHandler = event => {
  //   console.log(event)
  // }
  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
    setSelectedFile(event.target.files[0])
    setImages(URL.createObjectURL(event.target.files[0]));
    }
  }
  console.log("savedImg",images)

 const handleImageSave = async (e) => {
    console.log("e",e)
    e.preventDefault();
        const formData = new FormData();
        formData.append("_id", userdata._id);
        formData.append("profileImg", selectedFile);
        
        
        

    console.log("target",formData,userdata.firstName)
    axios
      .post("http://localhost:8000/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("demo",res);
        console.log("zelected",selectedFile)
        setSelectedImage(true)
      })
      .catch((err) => {
        console.log(err);
        alert(err)
      });
    }
  
  return (
    <div className='container container-home'>
        <h1>Home page</h1>
        <h2 className="username-home">Hii 👋 {userdata.firstName} {userdata.lastName}</h2>
      
        <form  onSubmit={handleImageSave}>
        <div style={{display: 'flex'}}>
                    <input  type="file" onChange={handleFileSelect}/>
                    <input className={'btn-upload'} type="submit"  />
                    </div>
                    </form>
                    
        <div className='share-this page'>
          {selectedImage && 
        <img src={images} width={150} height={300}  alt="preview image" />
          }
          <h3>Share this picture in Facebook</h3>
          <TwitterShareButton 
          url={images}>
            
            <TwitterIcon></TwitterIcon>
            
            <WhatsappIcon></WhatsappIcon>
          </TwitterShareButton>
         
          {/* <ShareButton {...shareButtonProps}>
              <FaFacebook />
            </ShareButton>; */}
        </div>
        <div className='preview'>
       
        </div>
        <button className='btn' onClick={logout}>Logout</button>

    </div>
    
  )
}

export default Home