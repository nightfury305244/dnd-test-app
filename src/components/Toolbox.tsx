import DraggableItem from "./DraggableItem";
import { Grid, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";

interface ToolboxProps {
  textOnPlate: string;
  setTextOnPlate: (text: string) => void;
  dateOnPlate: string;
  setDateOnPlate: (text: string) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({
  setTextOnPlate,
  textOnPlate,
  setDateOnPlate,
  dateOnPlate,
}) => {

  const symbols = useAppSelector(state => state.symbols.items);
  const icons = symbols.filter(symbol => symbol.type === 1);
  const plates = symbols.filter(symbol => symbol.type === 2);

  return (
    <Grid container direction={"column"} spacing={3} className="py-8">
      <Grid item container direction={"column"} alignItems={"center"} spacing={2}>
        <Grid item>
          <Typography variant="h6" className="text-lg font-bold mb-4">
            Icons
          </Typography>
        </Grid>
        <Grid item>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {icons.map((icon) => (
              <DraggableItem
                key={icon._id}
                _id={icon._id}
                url={icon.url}
                price={icon.price}
                type={"icon"}
              />
            ))}
          </div>
        </Grid>
      </Grid>
      <Grid item container direction={"column"} alignItems={"center"} spacing={2}>
        <Grid item>
          <Typography variant="h6" className="text-lg font-bold mb-4">
            Plates
          </Typography>
        </Grid>
        <Grid item>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {plates.map((plate) => (
              <DraggableItem
                key={plate._id}
                _id={plate._id}
                url={plate.url}
                price={plate.price}
                type={"plate"}
              />
            ))}
          </div>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={"column"}
        alignItems={"center"}
        spacing={3}
      >
        <Grid item>
          <TextField
            label="Text on Plate"
            value={textOnPlate}
            onChange={(e) => setTextOnPlate(e.target.value)}
            placeholder="Enter text for the plate"
          />
        </Grid>
        <Grid item>
          <TextField
            value={dateOnPlate}
            type="date"
            onChange={(e) => setDateOnPlate(e.target.value)}
            placeholder="Enter Date for the plate"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Toolbox;
