import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import useLocalStorage from "../../store/useLocalStorage";
import { StoneType } from "../../types/types";
import GravestoneCard from "./Stone";
import { useAppSelector } from "../../hooks";

interface ChooseStonePageProps {
  onNavigateNext: () => void;
}

const ChooseStonePage: React.FC<ChooseStonePageProps> = ({
  onNavigateNext,
}) => {
  const stones = useAppSelector((state) => state.stones.items);
  const [selectedStone, setSelectedStone] =
    useLocalStorage<StoneType>("selectedStone");
  const [_currentPrice, setCurrentPrice] =
    useLocalStorage<number>("currentPrice");
  const [selectedStoneId, setSelectedStoneId] = useState<string | null>(
    selectedStone ? selectedStone._id : null
  );

  const handleSelectStone = (stone: any) => {
    setSelectedStone(stone);
    setSelectedStoneId(stone._id);
    setCurrentPrice(stone.price);
    onNavigateNext();
  };

  return (
    <Grid
      container
      className="!w-9/12 !mx-auto"
      direction={"row"}
      justifyContent={"center"}
      spacing={3}
    >
      <Grid item>
        <Typography variant="h4" className="text-lg text-center font-bold">
          Choose a Gravestone
        </Typography>
      </Grid>
      <Grid container justifyContent={"center"} spacing={3}>
        {stones.map((stone) => (
          <Grid item key={stone._id}>
            <GravestoneCard
              url={stone.url}
              title={stone.name}
              price={`${stone.price}`}
              description={stone.description}
              selected={stone._id === selectedStoneId}
              onSelect={() => handleSelectStone(stone)}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ChooseStonePage;
