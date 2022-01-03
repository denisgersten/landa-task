import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import configData from '../../config/config.json'
import { Alert, Grid } from "@mui/material";



class Auth extends React.Component {
  state = {
    username: '',
    isFailed: false
  }
  
  
  handleInputChange = (event) => {
    this.setState({username: event.target.value})
  }
  

  handleLogin = (event) => {
    fetch(configData.SERVER_URL + '/login?' + new URLSearchParams({username: this.state.username}))
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.user) {
        localStorage.setItem("username", this.state.username)
        window.location.replace('http://localhost:3000/funds');
      }
      else {
        this.setState({isFailed: true})
      }
    });
  }


  handleNewUser = (event) => {
    if(this.state.username !== '') {
      fetch(configData.SERVER_URL + '/new-user', {
        method: 'POST',
        body: JSON.stringify({'username': this.state.username}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("username", this.state.username)
        window.location.replace('http://localhost:3000/funds');
      });
    }
    
  }

  render() {
    return(
      <Grid container 
        spacing={4}
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        style={{marginTop: "15px"}}>
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Welcome
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Enter your user name
            </Typography>
            <TextField onChange={this.handleInputChange} id="outlined-basic" label="Name" variant="outlined" />
          </CardContent>
          <CardActions>
            <Button onClick={this.handleLogin} size="small">Login</Button>
            <Button onClick={this.handleNewUser} size="small">Create User</Button>
          </CardActions>
          {this.state.isFailed && <Alert severity="error">User not found!</Alert> }
      </Card>
    </Grid>
    )
  }
}

export default Auth