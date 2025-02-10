import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { OrderCard } from "./components/order-card.view"
import { ServiceOrdersController } from "./service-orders.controller"

type props = {
  controller: ServiceOrdersController
}

export function ServiceOrdersView({controller}: props){

  return (
    <div className="max-w-[1100px] w-full">
      <div className="font-semibold mb-6 w-full h-8">
        Filtros
      </div>
      <DragDropContext onDragEnd={controller.onDragEnd} onDragStart={controller.onDragStart} onDragUpdate={controller.onDragUpdate} >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {Object.values(controller.columns.value).map((column) => (
            <Card key={column.id} className="bg-transparent border-0 shadow-transparent" >
              <CardHeader className="p-4" >
                <CardTitle className="text-sm font-medium">
                  {column.title} ({column.orders.length})
                </CardTitle>
              </CardHeader>
              <Droppable droppableId={column.id} >
                {(provided) => (
                  <CardContent 
                    {...provided.droppableProps} ref={provided.innerRef} 
                    className="space-y-3 sm:max-h-[calc(100vh-14.9rem)] lg:h-[calc(100vh-14.9rem)] overflow-y-auto p-3 pt-0"
                  >
                    {column.orders.map((order, index) => (
                      <Draggable key={order.id} draggableId={order.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 "
                          >
                            <OrderCard data={order} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )

}