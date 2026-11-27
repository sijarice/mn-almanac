import { useParams } from 'react-router';
import Typography from '@mui/material/Typography';

const DatePage = () => {
  const params = useParams();

  return <Typography variant="h1">Date Page: {params.date}</Typography>;
};

export default DatePage;
