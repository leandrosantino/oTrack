import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import { cn } from "@/lib/utils";

type props = {
  data: ServiceOrder
}

const priorityColors = {
  low: "bg-orange-100 text-orange-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-blue-100 text-blue-800",
}

export function OrderCard({data}: props) {
  return (
    <Card 
      className={cn(
        "px-2",
        data.priority === 'low' ? " hover:bg-orange-50/50" : " hover:bg-blue-50/50",
        data.status === 'done' && "border-green-500 hover:bg-green-50/50"
      )} 
    >
      <CardHeader className="flex-row justify-between items-center p-2 border-b border-border" > 
        <h1 className="font-medium text-sm" >
          OS - {data.id}
        </h1>
        <Badge variant="secondary" className={cn(
          priorityColors[data.priority],
          data.status === 'done' && "bg-green-100 text-green-800",
        )} >
          {data.priority === 'low' ? "Corretiva" : "Programada"}
        </Badge>
      </CardHeader>
      <CardContent className="p-2 text-sm h-16" >
        {data.description}
      </CardContent>
      <CardFooter className="p-2 text-xs flex-row justify-between items-center" >
        <div>MQ-005-2023</div>
        <div>{data.date.toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}