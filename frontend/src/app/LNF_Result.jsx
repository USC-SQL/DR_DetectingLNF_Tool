import React from 'react'
import { useNavigate , useLocation} from 'react-router-dom';


function LNF_Result(){
    const navigate = useNavigate();
    const location = useLocation(); //useLocation to read the state
    const { image } = location.state || {};

    const redirect = ()=>{
        navigate('/home')
    }
    return(
        <div>
            <h1>Here can display LLM results</h1>
            <button onClick={redirect}>Home</button>
            <h2>Uploaded Image:</h2>
            {image ? <img src={image} alt="Uploaded" /> : <p>No image found</p>}
        </div>
    )
}

export default LNF_Result;