import React from 'react';
import { useHistory } from 'react-router-dom';

const Info = ({ title, value, link  }) => {

    const history = useHistory();

    return (
        <div className="details">
      <h5>{title}: </h5>
      <h5 className="value cursor-pointer" onClick={()=> history.push(link)}>{value}</h5>
    </div>
    );
};

export default Info;