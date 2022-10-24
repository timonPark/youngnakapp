import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {TodoData} from "../type/TodoData";
import {
  DragDropContext,
  Draggable,
  DraggableProvided, DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult
} from "react-beautiful-dnd";
import Item from "./Item";

type Props = {
  todoDatas: TodoData[];
  setTodoDatas: Dispatch<SetStateAction<TodoData[]>>;
};

const Lists = React.memo((
    {todoDatas, setTodoDatas}: Props,
  ):JSX.Element => {
  const handleEnd = useCallback((result:DropResult) => {
    if(!result.destination) return;
    const newTodoDatas = todoDatas;

    const [reorderItem] = newTodoDatas.splice((result.source.index, 1));
    newTodoDatas.splice(result.destination.index, 0, reorderItem);
    setTodoDatas(newTodoDatas)
  }, [todoDatas, setTodoDatas]);
  const changeCheckbox = useCallback((id: number): void => {
    const changeTodoDatas = todoDatas.map((item) => {
      if (item.id === id){
        item.completed = !item.completed;
      }
      return item;
    });
    setTodoDatas(changeTodoDatas);
  }, [todoDatas, setTodoDatas])

  const deleteItem = (id: number): void => {
    const newTodoData = todoDatas.filter((data: TodoData) => data.id !== id)
    setTodoDatas(newTodoData)
  }
  return (
      <div>
        <DragDropContext onDragEnd={handleEnd}>
          <Droppable droppableId='handleEnd'>
            {(provided:DroppableProvided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {todoDatas.map((data:TodoData, index: number) => (
                    <Draggable draggableId={data.id.toString()} key={data.id} index={index}>
                      {(provided:DraggableProvided, snapshot:DraggableStateSnapshot) => (
                        <Item data={data} provided={provided} snapshot={snapshot} changeCheckbox={changeCheckbox} deleteItem={deleteItem} />
                      )}
                    </Draggable>
                ))}
                  {provided.placeholder}
                </div>
              )}
          </Droppable>
        </DragDropContext>
      </div>
  )
});

export default Lists;