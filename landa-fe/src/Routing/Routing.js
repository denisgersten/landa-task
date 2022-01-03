import React from "react";
import {Route, Routes} from "react-router-dom";
import Auth from "../Components/Auth/Auth";
import FundsTrade from "../Components/FundsTrade/FundsTrade";

class Routing extends React.Component {
  render() {
    let username = localStorage.getItem('username')
    console.log(username)
    return (
        <Routes>
          <Route path="/" element={<Auth />} />
          {username && <Route path="/funds" element={<FundsTrade />} />}
        </Routes>
    )
  }
}

export default Routing