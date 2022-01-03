import React from "react";
import configData from '../../config/config.json'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from "@mui/material";

class MyFundCard extends React.Component {
  state = {
    amount: 0,
    price: 0,
    isError: false
  }

  handleInputChange = (event) => {
    this.setState({[event.target.id]: event.target.value})
  }

  handleSell = () => {
    let username = localStorage.getItem('username')
    if((this.state.amount !== '' || this.state.amount !== 0) && (this.state.price !== '' || this.state.price !== 0)) {
      if (this.state.amount > this.props.fund.amount) {
        this.setState({isError: true})
      } else {
        fetch(configData.SERVER_URL + '/sell-fund-share', {
          method: 'POST',
          body: JSON.stringify({'fundId': this.props.fund.fundId,'amountToSell': this.state.amount, 'sharePrice': this.state.price, 'username': username}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
      }
    }
    
  }

  render() {
    return(
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            id: {this.props.fund.fundId}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Amount: {this.props.fund.amount}
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            label="Shares to sell"
            onChange={this.handleInputChange}
            value={this.state.amount}
            id="amount"
            type="number"
          />
          <TextField
            label="Shares price"
            onChange={this.handleInputChange}
            value={this.state.price}
            id="price"
            type="number"
          />
        </CardContent>
        <CardActions>
          <Button onClick={this.handleSell} size="small">Sell</Button>
        </CardActions>
        {this.state.isError && <Alert severity="error">You cant sell more than you have!</Alert> }
    </Card>
    )
  }
}

export default MyFundCard