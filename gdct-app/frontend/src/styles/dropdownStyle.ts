import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(0.25),
      fullWidth: true,
      display: 'flex'
    },
    select: {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'red',
      },
    },
  }));

export default useStyles;