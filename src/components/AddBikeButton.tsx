import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, type ButtonProps } from "@mui/material";

const AddBikeButton = ({...props }: Omit<ButtonProps, "children">) => {
  return (
    <Button
      startIcon={<AddOutlinedIcon />}
      {...props}
    >
      Add Bike
    </Button>
  )
}

export default AddBikeButton;
