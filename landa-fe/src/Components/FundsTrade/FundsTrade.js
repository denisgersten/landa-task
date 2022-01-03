import { Grid } from "@mui/material";
import React from "react";
import configData from '../../config/config.json'
import FundCard from "./FundCard";
import MyFundCard from "./MyFundCard";
import Typography from '@mui/material/Typography';


class FundsTrade extends React.Component {
  state = {
    funds: [],
    userPortfiolio: []
  }

  componentDidMount() {
    this.getFunds()
    this.getUserPortfolio()
  }



  getFunds = () => {
    fetch(configData.SERVER_URL + '/get-funds')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({funds: data['funds']})
    });
  }

  getUserPortfolio = () => {
    let username = localStorage.getItem('username')
    fetch(configData.SERVER_URL + '/get-user-portfolio?' + new URLSearchParams({username: username}))
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({userPortfiolio: data['portfolio']})
    });
  }

  render() {
    return(
      <div>
      <Typography variant="h5">
          All Founds
      </Typography>
      <Grid 
        container 
        spacing={4}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        style={{marginTop: "15px"}}
      >
        {this.state.funds.map((fund) => {
          return (
            <Grid item>
              <FundCard fund={fund} key={fund.id}/>
            </Grid>
          )
        })}
      </Grid>
      <Typography variant="h5" style={{marginTop: "15px"}}>
          My Founds
      </Typography>
      <Grid 
        container 
        spacing={4}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        style={{marginTop: "15px"}}
      >
        {this.state.userPortfiolio.map((fund) => {
          return (
            <Grid item>
              <MyFundCard fund={fund} key={fund.id}/>
            </Grid>
          )
        })}
      </Grid>
      </div>
    )
  }
}

export default FundsTrade