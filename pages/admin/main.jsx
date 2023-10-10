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
        Array.from({ length: data?.length }, (_, i) => (i + 1).toString())
      );
    });
  }, []);
  console.log(cardData, "hee");
  console.log(cardData, "original");
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={3}>
          {items?.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <Item cardData={cardData} id={activeId} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Main;
Main.getLayout = (page) => <MiniDrawer>{page}</MiniDrawer>;
