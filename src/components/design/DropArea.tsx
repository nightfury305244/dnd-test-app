import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { DraggableItem } from "../../types/types";
import IconItem from "./IconItem";
import PlateItem from "./PlateItem";
import { Box, Button, Grid, Typography } from "@mui/material";
import useLocalStorage from "../../store/useLocalStorage";

interface DropAreaProps {
  children: React.ReactNode;
  textOnPlate: string;
  dateOnPlate: string;
  droppedItems: DraggableItem[];
  setDroppedItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
  initialStonePrice: number;
}

const DropArea: React.FC<DropAreaProps> = ({
  children,
  textOnPlate,
  dateOnPlate,
  droppedItems,
  setDroppedItems,
  initialStonePrice,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const PLATE_SIZE = { width: 100, height: 100 };
  const ICON_SIZE = { width: 50, height: 50 };
  const [currentPrice, setCurrentPrice] =
    useLocalStorage<number>("currentPrice");
  const [price, setPrice] = useState<number>(currentPrice || initialStonePrice);

  useEffect(() => {
    if (droppedItems.length > 0) {
      const newPrice = droppedItems.reduce(
        (acc, item) => acc + item.symbol.price,
        initialStonePrice
      );
      setPrice(newPrice);
      setCurrentPrice(newPrice);
    } else {
      setPrice(initialStonePrice);
      setCurrentPrice(initialStonePrice);
    }
  }, [droppedItems, setCurrentPrice, initialStonePrice]);

  const [, drop] = useDrop(() => ({
    accept: ["symbol"],
    drop: (item: DraggableItem, monitor) => {
      console.log(item);
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && dropRef.current) {
        const dropAreaRect = dropRef.current.getBoundingClientRect();
        let itemSize = item.symbol.type === 2 ? PLATE_SIZE : ICON_SIZE;
        const x = clientOffset.x - dropAreaRect.left - itemSize.width / 2;
        const y = clientOffset.y - dropAreaRect.top - itemSize.height / 2;

        setDroppedItems((prevItems) => {
          const existingIndex = prevItems.findIndex(
            (di) =>
              di.symbol._id === item.symbol._id &&
              di.symbol.type == item.symbol.type
          );

          if (item.symbol.type === 2) {
            const filteredItems = prevItems.filter(
              (di) => di.symbol.type !== 2
            );
            return [
              ...filteredItems,
              {
                symbol: item.symbol,
                position: { x, y },
              },
            ];
          } else {
            if (existingIndex !== -1) {
              return prevItems.map((di) =>
                di.symbol._id === item.symbol._id ? { ...di, position: { x, y } } : di
              );
            } else {
              console.log({
                symbol: item.symbol,
                position: { x, y },
              })
              return [
                ...prevItems,
                {
                  symbol: item.symbol,
                  position: { x, y },
                },
              ];
            }
          }
        });
      }
    },
  }));

  drop(dropRef);

  const moveItem = (itemId: string, x: number, y: number) => {
    setDroppedItems((prevItems) =>
      prevItems.map((item) =>
        item.symbol._id === itemId ? { ...item, position: { x, y } } : item
      )
    );
  };

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={3}
    >
      <Grid item>
        <Box ref={dropRef} className="relative text-center">
          {children}
          {droppedItems.map((item, index) =>
            item.symbol.type === 2 ? (
              <PlateItem
                key={index}
                item={item}
                moveItem={moveItem}
                textOnPlate={textOnPlate}
                dateOnPlate={dateOnPlate}
              />
            ) : (
              <IconItem key={index} item={item} moveItem={moveItem} />
            )
          )}
        </Box>
      </Grid>
      <Grid
        item
        container
        direction={"row"}
        spacing={3}
        justifyContent={"center"}
      >
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() =>
              setDroppedItems((prev) =>
                prev.filter((item) => item.symbol.type !== 1)
              )
            }
          >
            Delete Icons
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() =>
              setDroppedItems((prev) =>
                prev.filter((item) => item.symbol.type !== 2)
              )
            }
          >
            Delete Plate
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">Current Price: €{price}</Typography>
      </Grid>
    </Grid>
  );
};

export default DropArea;
