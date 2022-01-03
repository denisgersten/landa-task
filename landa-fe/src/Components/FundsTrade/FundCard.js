import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import configData from '../../config/config.json'


class FundCard extends React.Component {
  state = {
    amount: 0,
    price: 0
  }

  handleInputChange = (event) => {
    this.setState({[event.target.id]: event.target.value})
  }

  handleBuy = () => {
    let username = localStorage.getItem('username')
    if((this.state.amount !== '' || this.state.amount !== 0) && (this.state.price !== '' || this.state.price !== 0)) {
      fetch(configData.SERVER_URL + '/buy-fund-share', {
        method: 'POST',
        body: JSON.stringify({'fundId': this.props.fund.id,'amountToBuy': this.state.amount, 'sharePrice': this.state.price, 'username': username}),
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
  

  render() {
    return(
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            id: {this.props.fund.id}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {this.props.fund.location}
          </Typography>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            Price: {this.props.fund.price}$
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            label="Shares to buy"
            onChange={this.handleInputChange}
            value={this.state.amount}
            id="amount"
            type="number"
          />
          <TextField
            label="Share price"
            onChange={this.handleInputChange}
            value={this.state.price}
            id="price"
            type="number"
          />
        </CardContent>
        <CardActions>
          <Button onClick={this.handleBuy} size="small">Buy</Button>
        </CardActions>
    </Card>
    )
  }
}

export default FundCard