import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({email,id,image,bankName,accountNo}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="330"
          image={image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" display={"flex"} alignItems={"center"} gap={2}>
            Email: <Typography fontSize={"16px"}>{email}</Typography>
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            UCPI-id: {id}
          </Typography>
          <Typography gutterBottom variant="h5" component="div" display={"flex"} alignItems={"center"} gap={2}>
            Bank Name: <Typography fontSize={"16px"}>{bankName}</Typography>
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Account No: {accountNo}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Account Balance: 100rs
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
