import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  rectSortingStrategy,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import Grid from "../components/Grid";
import SortableItem from "../components/SortableItem";
import Item from "../components/Item";
import MiniDrawer from "../components/Layout/userLayout";
import axios from "axios";

const Main = () => {
  const [items, setItems] = useState([]);
  const [cardData, setCardData] = useState([]);
  const base_url = "http://192.168.2.109:9000";
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  useEffect(() => {
    axios.get(`${base_url}/list/content`).then((response) => {
      console.log(response.data, "tset");
      const data = response.data.Details;

      setCardData(data);
      setItems(
        // Array.from({ length: data?.length }, (_, i) => (i + 1).toString())
        data
      );
    });
  }, []);
  console.log(cardData, "hee");
  console.log(cardData, "original");
  const bgcolors = [
    "#ffffff",
    "#a29bfe",
    "#ffeaa7",
    "#55efc4",
    "#DFCCFB",
    "#FFE5E5",
    "#EEE0C9",
    "#96B6C5",
    "#FBA1B7",
    "#98E4FF",
  ];
  const generateColor = () => {
    let index = Math.floor(Math.random() * 10);
    return bgcolors[index];
  };
  return (
    <div className="newdiv">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Grid columns={4}>
            {items?.map((id, index) => (
              <SortableItem key={id} id={id} colour={generateColor()} />
            ))}
          </Grid>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
          {activeId ? (
            <Item cardData={cardData} id={activeId} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Main;
Main.getLayout = (page) => <MiniDrawer>{page}</MiniDrawer>;
